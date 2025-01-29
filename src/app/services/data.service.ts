import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, DocumentReference, getDoc, getDocs, query } from 'firebase/firestore';
import { Firestore, updateDoc } from '@angular/fire/firestore';

/**
* @class DataService
* @description This class interacts with Firestore for data operations.
*/
@Injectable({
  providedIn: 'root'
})
export class DataService {

 
  /**
  * @constructor
  * @param {Firestore} firestore - The Firestore instance for interacting with Firestore database.
  * @description This constructor injects the Firestore service to allow interaction with the Firestore database.
  */
  constructor(private firestore: Firestore) { }

  /**
  * @async
  * @method addTask
  * @description Adds a new task to the Firestore database under the "tasks" collection.
  * @param {Object} taskData - The task data to be added to the Firestore database. This includes fields like name, due date, description, status, etc.
  * @returns {Promise<DocumentReference>} A promise that resolves to the Firestore document reference of the newly added task.
  * @throws {Error} Throws an error if adding the task to the Firestore database fails.
  */
  async addTask(taskData: any): Promise<DocumentReference> {

    try {

      // Reference to the Firestore "tasks" collection
      const taskCollection = collection(this.firestore, 'tasks')

      // Add the task data to the Firestore "tasks" collection
      const taskRef = await addDoc(taskCollection, taskData)

      // Return the Firestore document reference for the added task
      return taskRef

    } catch (error) {
      // Log and re-throw the error for the calling function to handle
      console.error('Error during adding a task:', error);
      throw new Error('Failed to add the task. Please try again later.')
    }
  }

  /**
  * @async
  * @method getTasks
  * @description Fetches all tasks from the Firestore "tasks" collection, returning them as an array of objects with their respective IDs.
  * @returns {Promise<Array<{ id: string; [key: string]: any }>>} A promise that resolves to an array of task objects, each containing an `id` and its corresponding data.
  * @throws {Error} Throws an error if the retrieval of tasks from Firestore fails.
  */
  async getTasks(): Promise<Array<{ id: string;[key: string]: any }>> {

    try {

      // Reference the Firestore "tasks" collection
      const taskRef = collection(this.firestore, 'tasks')
      // Execute the Firestore query to fetch all documents from the "tasks" collection
      const taskQuery = await getDocs(query(taskRef))

      // Transform the query snapshot into an array of structured task objects
      return taskQuery.docs.map((doc) => ({

        id: doc.id, // Include the Firestore document ID
        ...doc.data()  // Include all fields from the document
      }))
    } 
    catch(error) {
      // Log the error for debugging and re-throw it with a user-friendly message
      console.log('Error fetching tasks:', error)
      throw new Error('Failed to fetch tasks. Please try again later.')
    }
  }
 
  /**
  * @async
  * @method getTaskById
  * @description Fetches a task document from Firestore by its ID.
  *              If the task exists, returns the task data along with its ID.
  *              If the task is not found, throws an error.
  * @param {string} taskId - The unique ID of the task to fetch.
  * @returns {Promise<{ id: string; [key: string]: any }>} A promise that resolves with the task data.
  * @throws {Error} If the task ID is missing, Firestore request fails, or the task does not exist.
  */
  async getTaskById(taskId: any): Promise<{ id: string; [key: string]: any }> {

    try {

      // Validate Booking ID
      if (!taskId) {
        throw new Error('Task ID is required to fetch tasks.');
      }

      const taskSnap = await getDoc(doc(this.firestore, 'tasks', taskId))

      // Check if the document exists
      if (taskSnap.exists()) {
        return { id: taskSnap.id, ...taskSnap.data() }
      }
      else {
        // Document not found, throw an error
        throw new Error('task with ID' + taskId + 'not found.')
      }

    } catch (error) {

      console.error('Error fetching task with ID' + taskId, error)
      throw new Error('Failed to fetch task details for ID' + taskId)
    }
  }

  /**
  * @async
  * @method removeTask
  * @description Deletes a task from Firestore using its task ID.
  *              Throws an error if the task ID is missing or the deletion fails.
  * @param {string} taskId - The unique ID of the task to be deleted.
  * @returns {Promise<void>} A promise that resolves when the task is successfully deleted.
  * @throws {Error} If the task ID is missing or if an error occurs during deletion.
  */
  async removeTask(taskId: any): Promise<void> {

    try {

      if (!taskId) {
        throw new Error('Invalid roomID: roomID cannot be null or undefined.')
      }

      // Reference to the specific task document
      const taskRef = doc(this.firestore, 'tasks/' + taskId)

      // Delete the document from Firestore
      await deleteDoc(taskRef)

    } catch (error) {
      // Log the error for debugging purposes
      console.error('Error deleting task with ID ' + taskId + ', error')
      // Re-throw the error for further handling if needed
      throw new Error('Failed to delete the task. Please try again later.')
    }

  }

  /**
  * @async
  * @method updateTask
  * @description Updates an existing task in Firestore with the provided task data.
  *              Throws an error if the task ID is missing or the update fails.
  * @param {string} taskId - The unique ID of the task to be updated.
  * @param {Partial<Record<string, any>>} taskData - An object containing the updated task fields.
  * @returns {Promise<void>} A promise that resolves when the task is successfully updated.
  * @throws {Error} If the task ID is missing, task data is empty, or an error occurs during the update.
  */
  async updateTask(taskId :any, taskData: any) : Promise<void> {

    try {

      // Validate Task ID
      if (!taskId) {
        throw new Error('Invalid taskId: Task ID cannot be null or undefined.');
      }

      // Validate Task Data
      if (!taskData || Object.keys(taskData).length === 0) {
        throw new Error('Invalid taskData: Task data cannot be empty.');
      }

      // Reference to the specific task document in the Firestore collection
      const taskRef = doc(this.firestore, 'tasks/'+ taskId)

      // Update the room document with the provided data
      await updateDoc(taskRef,taskData)

    } catch (error) {

      console.error('Error updating task with ID ' + taskId + ':', error);
      throw new Error('Failed to update task:' + error);
    }
  } 

  /**
  * @async
  * @method checkAndUpdateOverdueTasks
  * @description Checks if a task is overdue and updates Firestore accordingly.
  * @param {string} taskId - The ID of the task to check.
  * @param {any} dueDate - The due date of the task.
  * @param {string} status - The current status of the task.
  * @returns {Promise<void>} Resolves after checking and updating the task.
  */
  async checkAndUpdateOverdueTasks(taskId: string, dueDate: any, status: string): Promise<void> {

    try {

      const currentDate = new Date().toISOString().split('T')[0]
      const taskDueDate = new Date(dueDate).toISOString().split('T')[0]
      
      // Check if the task is overdue
      if (status !== 'Completed' && taskDueDate < currentDate) {
        const taskRef = doc(this.firestore, 'tasks', taskId)
  
        // Update the task in Firestore
        await updateDoc(taskRef, { hasOverDue: true })
      }
    } catch (error) {
      console.error('Error checking/updating overdue status:', error)
    }
  }

}
