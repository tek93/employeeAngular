import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from './employee';
import { EmployeeSerivceService } from './services/employee-serivce.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'employeeMgr';
  public employees:Employee[];
  editEmployee:Employee;
  deleteEmployee:Employee;
  employee = new Employee();
  

  public selectedFile;
  imgURL: any;
  employeeRecieved: Array<Employee>;
  employeeTemp = new Employee();
  



  


  constructor(private http:HttpClient, private employeeService:EmployeeSerivceService){

  }
  ngOnInit(): void {
   this.getEmployess();
  }

  public getEmployess():void{

    this.employeeService.getEmployee().subscribe(
      (response:Employee[])=>{
        this.employees = response;
        this.handleSuccessfulResponse(response);
      },
      (error:HttpErrorResponse)=>{
        alert(error.message);
      }
    );
  }
  handleSuccessfulResponse(response) {
    this.employees = new Array<Employee>();
    //get books returned by the api call
    this.employeeRecieved = response;
    for (const employee of this.employeeRecieved) {
    
      const emplwithRetrievedImageField = new Employee();
      emplwithRetrievedImageField.id = employee.id;
      emplwithRetrievedImageField.name = employee.name;
      //populate retrieved image field so that book image can be displayed
      emplwithRetrievedImageField.picByte = 'data:image/jpeg;base64,' + employee.picByte;
      emplwithRetrievedImageField.phone = employee.phone;
      emplwithRetrievedImageField.jobTitle = employee.jobTitle;
      emplwithRetrievedImageField.email=employee.email;
      this.employees.push(emplwithRetrievedImageField);
     
    }
  }
  onAddEmployee(addForm:NgForm):void{
    document.getElementById('add-employee-form').click();
    const uploadData = new FormData();
    uploadData.append('imageFile', this.selectedFile, this.selectedFile.name);
    this.selectedFile.imageName = this.selectedFile.name;

     this.http.post('https://employeeapp4.herokuapp.com/employee/upload', uploadData, { observe: 'response' })
      .subscribe((response) => {
        if (response.status === 200) {
          this.employeeService.addEmployee(addForm.value).subscribe(
            (employee) => {
       
              addForm.reset();
            }
          );
          console.log('Image uploaded successfully');
        } else {
          console.log('Image not uploaded successfully');
        }
      }
      );
  }
    
   
  searchEmployees(key:string){
    const results:Employee[]=[];
    for(const employee of this.employees){
      if(employee.name.toLowerCase().indexOf(key.toLowerCase())!==-1
      ||employee.email.toLowerCase().indexOf(key.toLowerCase())!==-1
      ||employee.jobTitle.toLowerCase().indexOf(key.toLowerCase())!==-1
      ||employee.phone.toLowerCase().indexOf(key.toLowerCase())!==-1){
        results.push(employee);
      }
    }
    this.employees=results;
    if(results.length===0||!key){
      this.getEmployess();
    }

  }
  onDeleteEmployee(employeeId:number):void{
  
    
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response:void)=>{
        console.log(response);
        this.getEmployess();
      },
      (error:HttpErrorResponse)=>{
        alert(error.message);
      }
    )

  }
  onUpdateEmployee(employee:Employee):void{
    this.onAddEmployee;
  
    
    // this.employeeService.addEmployee(employee).subscribe(
    //   (response:Employee)=>{
    //     console.log(response);
    //     this.getEmployess();
    //   },
    //   (error:HttpErrorResponse)=>{
    //     alert(error.message);
    //   }
    // )

  }
  onOpenModal(employee:Employee, mode:string) :void{
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type='button';
    button.style.display='node';
    button.setAttribute('data-toggle', 'modal');
    if(mode==='add'){
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if(mode==='edit'){
      this.editEmployee=employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if(mode==='delete'){
      this.deleteEmployee=employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container.appendChild(button);
    button.click();

  }
  public onFileChanged(event) {
    console.log(event);
    this.selectedFile = event.target.files[0];

    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event2) => {
      this.imgURL = reader.result;
    };

  }
  


}
