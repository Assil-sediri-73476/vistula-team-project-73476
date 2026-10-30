'use strict';

const el = id => document.getElementById(id);
const form = el('task-form');
const titleInput = el('task-title');
const descriptionInput = el('task-description');
const list = el('task-list');
let config;
let tasks = [];
let editingId = null;
let busy = false;

function message(text, error = false) {
  el('status-message').textContent = text;
  el('status-message').classList.toggle('error', error);
}

function setBusy(value) {
  busy = value;
  form.querySelectorAll('input, textarea, button').forEach(node => { node.disabled = value || !config; });
  list.querySelectorAll('button').forEach(node => { node.disabled = value; });
  el('refresh-tasks').disabled = value;
  list.setAttribute('aria-busy', String(value));
}

async function request(query, { method = 'GET', body } = {}) {
  const response = await fetch(`${config.supabaseUrl}/rest/v1/tasks${query}`, {
    method,
    headers: {
      apikey: config.supabasePublishableKey,
      'Content-Type': 'application/json',
      ...(method !== 'GET' ? { Prefer: 'return=representation' } : {})
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    cache: 'no-store',
    signal: AbortSignal.timeout(20000)
  });
  const text = await response.text();
  let result;
  try { result = text ? JSON.parse(text) : null; } catch { throw new Error('The database returned an unreadable response.'); }
  if (!response.ok) throw new Error(result?.message || `Database request failed (${response.status}).`);
  return result;
}

async function readTasks() {
  // Page through results so tasks beyond the API's default row limit are included.
  const result = [];
  let offset = 0;
  for (;;) {
    const page = await request(`?select=*&order=id.asc&limit=500&offset=${offset}`);
    if (!Array.isArray(page)) throw new Error('The database did not return a task list.');
    result.push(...page);
    if (page.length === 0) break;
    offset += page.length;
  }
  tasks = result;
  render();
}

function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function render() {
  list.replaceChildren();
  el('task-count').textContent = tasks.length;
  if (!tasks.length) {
    const empty = make('div', 'empty');
    empty.append(make('strong', '', 'Room for a fresh start.'), make('span', '', 'Add your first task to get moving.'));
    list.append(empty);
    return;
  }
  for (const task of tasks) {
    const item = make('article', `task-item${task.completed ? ' completed' : ''}`);
    item.dataset.id = String(task.id);
    item.append(make('h3', 'task-title', task.title), make('p', 'task-description', task.description || ''));
    const bottom = make('div', 'task-bottom');
    bottom.append(make('span', 'task-status', task.completed ? 'Completed' : 'Incomplete'));
    const actions = make('div', 'task-actions');
    for (const [className, label] of [['toggle-task', task.completed ? 'Mark incomplete' : 'Complete'], ['edit-task', 'Edit'], ['delete-task', 'Delete']]) {
      const button = make('button', className + (className === 'edit-task' ? ' secondary' : ''), label);
      button.type = 'button';
      button.setAttribute('aria-label', `${label}: ${task.title}`);
      actions.append(button);
    }
    bottom.append(actions);
    item.append(bottom);
    list.append(item);
  }
}

function resetForm() {
  editingId = null;
  form.reset();
  el('form-heading').textContent = 'New task';
  el('task-submit').textContent = 'Add task ↗';
  el('cancel-edit').hidden = true;
}

async function run(operation) {
  if (busy) return;
  setBusy(true);
  try { await operation(); }
  catch (error) {
    const detail = error.name === 'TimeoutError' ? 'The connection timed out. Please try again.' : error.message;
    message(`${detail} Refresh the list before retrying if you are unsure whether a change was saved.`, true);
  } finally { setBusy(false); }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!config || busy) return;
  const title = titleInput.value.trim();
  if (!title) { message('Please enter a task title.', true); titleInput.focus(); return; }
  const body = { title, description: descriptionInput.value.trim() };
  run(async () => {
    const editing = editingId !== null;
    if (editing) {
      const result = await request(`?id=eq.${encodeURIComponent(editingId)}`, { method: 'PATCH', body });
      if (!result?.length) throw new Error('This task no longer exists. Refresh the list.');
    } else {
      await request('', { method: 'POST', body: { ...body, completed: false } });
    }
    resetForm();
    await readTasks();
    message(editing ? 'Task updated.' : 'Task added.');
    titleInput.focus();
  });
});

list.addEventListener('click', event => {
  const button = event.target.closest('button');
  const item = button?.closest('.task-item');
  if (!item || busy) return;
  const task = tasks.find(task => String(task.id) === item.dataset.id);
  if (!task) return;
  if (button.classList.contains('edit-task')) {
    editingId = String(task.id);
    titleInput.value = task.title;
    descriptionInput.value = task.description || '';
    el('form-heading').textContent = 'Edit task';
    el('task-submit').textContent = 'Save changes ↗';
    el('cancel-edit').hidden = false;
    titleInput.focus();
    message('Editing task. Save your changes or cancel.');
    return;
  }
  const deleting = button.classList.contains('delete-task');
  if (deleting && !window.confirm(`Delete “${task.title}”?`)) return;
  run(async () => {
    const result = await request(`?id=eq.${encodeURIComponent(String(task.id))}`, deleting
      ? { method: 'DELETE' }
      : { method: 'PATCH', body: { completed: !task.completed } });
    if (!result?.length) throw new Error('This task no longer exists. Refresh the list.');
    if (deleting && editingId === String(task.id)) resetForm();
    await readTasks();
    message(deleting ? 'Task deleted.' : 'Task status updated.');
  });
});

el('cancel-edit').addEventListener('click', () => { resetForm(); message('Editing cancelled.'); });
el('refresh-tasks').addEventListener('click', () => config ? run(async () => { await readTasks(); message('Tasks refreshed.'); }) : initialize());

async function initialize() {
  await run(async () => {
    const response = await fetch('config.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not load config.json.');
    const settings = await response.json();
    if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(settings.supabaseUrl || '') || !/^sb_publishable_/.test(settings.supabasePublishableKey || '') || settings.tableName !== 'tasks') {
      throw new Error('Setup is incomplete. Add your Supabase project URL and public publishable key to config.json; tableName must be tasks.');
    }
    config = { ...settings, supabaseUrl: settings.supabaseUrl.replace(/\/$/, '') };
    await readTasks();
    message('Workspace connected. Your tasks are up to date.');
  });
}

initialize();
