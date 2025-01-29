import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent,IonButton,IonButtons,IonCard,IonList,IonItem,IonLabel} from '@ionic/angular/standalone';
import { DataService } from '../services/data.service';
import { SortByDatePipe } from '../sort-by-date.pipe';

/**
* @class HomePage Component
* @author Mncedisi Masondo
* @description Component that handles task management, including loading tasks, viewing task details, and adding new tasks.
*/
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent,IonButton,IonButtons,IonCard,IonList
  ,IonItem,IonLabel,DatePipe,NgClass,NgFor,NgIf,SortByDatePipe],
})
export class HomePage {

  /**
  * Array holding the list of tasks.
  * @property {any[]} tasks
  */
  tasks: any[] = []

  /**
  * @constructor
  * @param {Router} router - Angular's Router for navigation.
  * @param {DataService} dataService - Service for interacting with task data.
  */
  constructor(private router: Router,private dataService: DataService) { }

  /**
  * Lifecycle hook that runs when the component initializes.
  * It loads the tasks for the component.
  * @returns {Promise<void>}
  */
  ngOnInit() : void {
    // Load tasks when the component is initialized
    this.loadTasks()
  }

  /**
  * Loads the tasks from the DataService.
  * @async
  * @method loadTasks
  * @returns {Promise<void>} A promise that resolves when the tasks are loaded.
  * @throws {Error} If there is an error fetching tasks from the DataService.
  */
  async loadTasks() : Promise<void>{

    try {
      // Fetch tasks from the DataService and store them in the 'tasks' array
      this.tasks = await this.dataService.getTasks()
      
    } catch (error) {
      // Log any errors encountered while fetching tasks
      console.error('Error loading tasks:', error)
    }
  }

  /**
  * @method goToTaskDetails
  * @description Navigates to the task details page.
  * @param {any} id - The ID of the task to view.
  */
  goToTaskDetails(id:any) {

    // Navigate to the task detail page using the provided task ID
    this.router.navigate(['/todo-detail', id])
  }

  /**
  * @method addNewTask
  * @description Navigates to the page for adding a new task.
  */
  addNewTask() {
    // Navigate to the "add new task" page
    this.router.navigate(['/add-todo'])
  }
}
