import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader,IonTitle,IonToolbar,IonButtons,IonBackButton,IonCard,IonCardHeader,
IonCardSubtitle,IonCardTitle, IonCardContent,IonLabel,IonList,IonDatetime, IonItem,IonSelect,IonSelectOption,
IonButton, IonAlert } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../services/data.service';

/**
* @class TodoDetailPage
* @author Mncedisi Masondo
* @description This component is responsible for displaying task details, updating task status, rescheduling tasks, and removing tasks.
*/
@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.page.html',
  styleUrls: ['./todo-detail.page.scss'],
  standalone: true,
  imports: [IonAlert, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonButtons,IonBackButton,
  IonCard,IonCardHeader,IonCardSubtitle,IonCardTitle,IonCardContent,IonLabel,IonList,IonDatetime,IonSelect,IonButton,
IonSelectOption]
})
export class TodoDetailPage implements OnInit {

  /**
  * The task object that contains the details of the current task.
  * @property {any} task
  */
  task : any

  /**
  * The ID of the current task
  * @property {any} taskId
  */
  taskId : any

  public alertButtons = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Yes',
      cssClass: 'alert-button-confirm',
      handler: async () => {
        await this.removeTask() // Calls removeTask() only if user confirms
      }
    },
  ]

  /**
  * @constructor
  * @param {ActivatedRoute} route - The route service for retrieving route parameters.
  * @param {DataService} dataService - Service for interacting with task data.
  * @param {Router} router - Angular's Router for navigation.
  */
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {}

  /**
  * Lifecycle hook that runs when the component is initialized.
  * It retrieves the task ID from the route and fetches the task details if an ID is found.
  */
  ngOnInit() {

    // Get task ID from the route parameter
    this.taskId = this.route.snapshot.paramMap.get('id') || ''

    // If a valid task ID is found, fetch the task details
    if(this.taskId){
      this.fetchTaskDetails()
    }
  }

  /**
  * @async
  * @method fetchTaskDetails
  * @description Fetches the details of a specific task using its ID.
  * @returns {Promise<void>} Resolves when the task details are successfully fetched.
  * @throws Will log an error if fetching task details fails.
  */
  async fetchTaskDetails():Promise<void> {

    try {
      // Fetch task details from the data service
      this.task = await this.dataService.getTaskById(this.taskId)

      if(this.task){
        // If the task is found, check and update its overdue status
        await this.dataService.checkAndUpdateOverdueTasks(this.taskId,this.task.dueDate,this.task.status)
      }

    } catch (error) {

      // Log error if task details fetch fails
      console.error('Error fetching task details:', error)
    }
  }

   /**
  * @async
  * @method rescheduleTask
  * @description Reschedules the task by updating its due date.
  * @param {any} newDueDate - The new due date to set for the task.
  * @returns {Promise<void>} Resolves when the task is successfully rescheduled.
  * @throws {Error} Logs an error if rescheduling the task fails.
  */
  async rescheduleTask(newDueDate: any): Promise<void> {

    try {

      // Prepare data for rescheduling the task
      const taskData = { dueDate : newDueDate }

      // Call the data service to update the task's due date
      await this.dataService.updateTask(this.taskId,taskData)

    } catch (error) {
      // Log any error encountered during rescheduling
      console.error('Error rescheduling task:', error)
    }
  }

   /**
  * @async
  * @method updateTaskStatus
  * @description Updates the status of the task.
  * @param {string} newStatus - The new status to set for the task (e.g., 'Completed', 'Pending').
  * @returns {Promise<void>} Resolves when the task status is successfully updated.
  * @throws {Error} Logs an error if updating the task status fails.
  */
  async updateTaskStatus(newStatus: any): Promise<void>{

    try {

      // Prepare data for updating the task's status
      const taskData = { status : newStatus }
      // Call the data service to update the task status
      await this.dataService.updateTask(this.taskId,taskData)

    } catch (error) {
      // Log any error encountered during the status update
      console.error('Error updating task status:', error)
    }
  }

  /**
  * @async
  * @method removeTask
  * @description Removes the current task from the task list and navigates back to the home page.
  * @returns {Promise<void>} Resolves when the task is successfully removed.
  * @throws {Error} Logs an error if removing the task fails.
  */
  async removeTask(): Promise<void>{

    try {
      // Call the data service to remove the task by its ID
      await this.dataService.removeTask(this.taskId)

      // Navigate to the home page after task removal
      this.router.navigate(['/home'])

    } catch (error) {
      // Log any error encountered during task removal
      console.error('Error removing task:', error)
    }
  }

}
