import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee.model';
import { EmployeeService } from '../employee.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-addemployee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addemployee.component.html',
  styleUrls: ['./addemployee.component.css']
})

export class AddemployeeComponent implements OnInit {
  newEmployee: Employee = new Employee(0, '', '');
  submitBtnText: string = "Create";
  imgLoadingDisplay: string = 'none';
  employeeList: Employee[] = [];

  constructor(private employeeService: EmployeeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const employeeId = params['id'];
      if(employeeId)
      this.editEmployee(employeeId);
    });

    // Obtener todos los empleados
    this.employeeService.getAllEmployee().subscribe((employees: Employee[]) => {
      this.employeeList = employees;
    });
  }

  addEmployee(employee: Employee) {
    if (employee.name == ""){
      this.toastr.warning('El nombre no puede estar vacio.', 'Advertencia');
      return;
    }

    if (employee.name.length > 100){
      this.toastr.error('El nombre no puede tener mas de 100 caracteres', 'Error');
      return;
    }

    if (employee.name.length < 2){
      this.toastr.error('El nombre no puede tener menos de 2 caracteres', 'Error');
      return;
    }

    const number = /\d/;
    if (number.test(employee.name)) {
      this.toastr.error('El nombre no puede tener numeros.', 'Error');
      return;
    }

    const letters = /(\w)\1{2,}/;
    if (letters.test(employee.name)) {
      this.toastr.error('El nombre no puede tener mas de 3 letras iguales seguidas.', 'Error');
      return ;
    }

    const nameExists = this.employeeList.some(emp => emp.name.toLowerCase() === employee.name.toLowerCase());
    if (nameExists) {
      this.toastr.error('El nombre del empleado ya existe.', 'Error');
      return;
    }

    if (employee.id == 0) {
      employee.createdDate = new Date().toISOString();
      this.employeeService.createEmployee(employee).subscribe(result=>this.router.navigate(['/']));
    }
    else {
      employee.createdDate = new Date().toISOString();
      this.employeeService.updateEmployee(employee).subscribe(result=>this.router.navigate(['/']));
    }
    this.submitBtnText = "";
    this.imgLoadingDisplay = 'inline';
  }

  editEmployee(employeeId: number) {
    this.employeeService.getEmployeeById(employeeId).subscribe(res => {
      this.newEmployee.id = res.id;
      this.newEmployee.name = res.name
      this.submitBtnText = "Edit";
    });
  }

}
