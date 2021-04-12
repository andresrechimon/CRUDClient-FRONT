import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClientserviceService } from 'src/app/services/clientservice.service';

@Component({
  selector: 'app-client-component',
  templateUrl: './client-component.component.html',
  styleUrls: ['./client-component.component.css']
})
export class ClientComponentComponent implements OnInit {

  listClients: any [] = [];
  action = 'Agregar';
  form: FormGroup;
  id: number  | undefined;

  constructor(private fb:FormBuilder,
    private toastr: ToastrService,
    private _clientsService: ClientserviceService) { 
    this.form = this.fb.group({
      dni: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(10)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.obtainClients();
  }

  obtainClients(){
    this._clientsService.getListClients().subscribe(data => {console.log(data);this.listClients = data;},
    error => {
      console.log(error);
    })
  }

  storeClient(){
    const client: any={
      dni: this.form.get('dni')?.value,
      name: this.form.get('name')?.value,
      phone: this.form.get('phone')?.value,
      address: this.form.get('address')?.value,
      city: this.form.get('city')?.value,
      province: this.form.get('province')?.value,
    }

    if(this.id == undefined){
      //ADD NEW CLIENT
      let existe = false;
      this.listClients.forEach(client => {
        
        if(client.dni === this.form.get('dni')?.value){
          existe = true;
        return(console.log('igual'));

      }
    })
    if(existe){
      this.toastr.warning('No se permiten DNI idénticos.', '¡Cuidado!');
    }
    else{
      this._clientsService.saveClient(client).subscribe(data => {
        this.toastr.success('¡El Cliente fue registrado con éxito!', 'Cliente dado de alta.');
        this.obtainClients();
        this.form.reset();
      }, error =>{
        this.toastr.error('Ufa... ocurrió un error!','Error.')
        console.log(error);
      })
    }
    
    }else{
      client.id = this.id;
      //EDIT CLIENT ALREADY ON THE REGISTER
      this._clientsService.updateClient(this.id, client).subscribe(data => {
        this.form.reset();
        this.action = 'Agregar';
        this.id = undefined;
        this.toastr.info('¡El Cliente fue actualizado con éxito!','Cliente actualizado.');
        this.obtainClients();
      }, error => {
        console.log(error);
      })
    }
  }

  deleteClient(id: number){
    this._clientsService.deleteClient(id).subscribe(data => {
      this.toastr.error('¡El Cliente fue eliminado con éxito!', 'Client dado de baja.');
      this.obtainClients();
    }, error => {
      console.log(error);
    })
  }

  editClient(client: any){
    this.action= 'Editar';
    this.id = client.id;

    this.form.patchValue({
      dni: client.dni,
      name: client.name,
      phone: client.phone,
      address: client.address,
      city: client.city,
      province: client.province
    })
  }
}
