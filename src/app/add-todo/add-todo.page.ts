import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonDatetime, IonTextarea, IonButton,IonSelect, IonSelectOption, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonAlert, IonText } from '@ionic/angular/standalone';
import { DataService } from '../services/data.service';

/**
* @class AddToDoPage
* @author Mncedisi Masondo
* @description This component handles the creation of new tasks using a reactive form.
*/
@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.page.html',
  styleUrls: ['./add-todo.page.scss'],
  standalone: true,
  imports: [IonText, IonAlert, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonButton, IonTextarea, IonDatetime, IonInput, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonSelect,IonSelectOption,ReactiveFormsModule]
})
export class AddTodoPage implements OnInit {

  /**
  * The form group that holds the task creation form controls.
  * @property {FormGroup} todoForm
  */
  todoForm : FormGroup

  public alertButtons = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Yes',
      cssClass: 'alert-button-confirm',
      handler: async () => {
        await this.onCreateTask() // Calls onCreateTask only if user confirms
      }
    },
  ]

 /**
  * @constructor
  * @param {FormBuilder} fb - The FormBuilder service used to build the form.
  * @param {DataService} dataService - Service for interacting with task data.
  */
  constructor(private fb : FormBuilder,private dataService: DataService) { 

    // Initialize the todoForm with validation rules for each form control
    this.todoForm = this.fb.group({
       // Task Name (Required field)
       taskName: ['', Validators.required],
       // Due Date (Required field)
       dueDate: ['', Validators.required],
       // Priority (Required field)
       priority: ['', Validators.required],
       // Description (Required field)
       description: ['', Validators.required]
    })
  }

  /**
  * Lifecycle hook that runs when the component initializes.
  * Used for any initialization logic that doesn't require form interaction.
  */
  ngOnInit(): void {}

  /**
  * Handles form submission and task creation.
  * @async
  * @method onCreateTask
  * @description This method is called when the user submits the task creation form.
  * It checks if the form is valid and then sends the task data to the server.
  * @returns {Promise<void>} A promise that resolves when the task creation is complete.
  * @throws {Error} If there's an error while adding the task.
  */
  async onCreateTask(): Promise<void>  {

    try {
      // Check if the form is invalid (missing required fields)
      if(this.todoForm.invalid){
        console.log('Form invalid')
        return
      }

      // Prepare task data from the form values
      const taskData = {
        taskName: this.todoForm.get('taskName')?.value, // Task Name
        dueDate: this.todoForm.get('dueDate')?.value,   // Due Date
        priority: this.todoForm.get('priority')?.value, // Priority
        description: this.todoForm.get('description')?.value, // Description
        hasOverDue: false, // Default value for task overdue status
        status: 'Pending' // Initial status of the task
      } 
   
      // Call the data service to add the new task
      const taskDetails = await this.dataService.addTask(taskData)

      this.todoForm.reset()
  
    } catch (error) {

      // Log any errors that occur during task creation
      console.log('Error while creating task:', error)
    }
  }

}
