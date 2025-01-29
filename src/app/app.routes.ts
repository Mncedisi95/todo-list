import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'todo-detail/:id',
    loadComponent: () => import('./todo-detail/todo-detail.page').then( m => m.TodoDetailPage)
  },
  {
    path: 'add-todo',
    loadComponent: () => import('./add-todo/add-todo.page').then( m => m.AddTodoPage)
  },
];
