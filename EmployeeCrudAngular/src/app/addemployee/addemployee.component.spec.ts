import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AddemployeeComponent } from './addemployee.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr'; // Importar ToastrService para la simulación

describe('AddemployeeComponent', () => {
  let component: AddemployeeComponent;
  let fixture: ComponentFixture<AddemployeeComponent>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['error', 'warning']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AddemployeeComponent], // Importa el componente standalone aquí
      providers: [
        DatePipe,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ id: 1 }) // simula el parámetro id en la URL
          }
        },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    });

    fixture = TestBed.createComponent(AddemployeeComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  it('should show warning if name is empty', () => {
    component.newEmployee.name = '';
    component.addEmployee(component.newEmployee);
    expect(toastrService.warning).toHaveBeenCalledWith('El nombre no puede estar vacio.', 'Advertencia');
  });

  it('should show error if name is longer than 100 characters', () => {
    component.newEmployee.name = 'A'.repeat(101);
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith('El nombre no puede tener mas de 100 caracteres', 'Error');
  });

  it('should show error if name is shorter than 2 characters', () => {
    component.newEmployee.name = 'A';
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith('El nombre no puede tener menos de 2 caracteres', 'Error');
  });

  it('should show error if name contains numbers', () => {
    component.newEmployee.name = 'John1 Doe';
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith('El nombre no puede tener numeros.', 'Error');
  });

  it('should show error if name has more than 3 identical letters in a row', () => {
    component.newEmployee.name = 'Joooohn Doe';
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith('El nombre no puede tener mas de 3 letras iguales seguidas.', 'Error');
  });

  it('should show error if name already exists in the employee list', () => {
    component.employeeList = [{ id: 1, name: 'John Doe', createdDate: Date() }];
    component.newEmployee.name = 'John Doe';
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith('El nombre del empleado ya existe.', 'Error');
  });
});