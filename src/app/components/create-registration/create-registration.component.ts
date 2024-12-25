import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ManagemantService } from 'src/app/services/managemant.service';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.css']
})
export class CreateRegistrationComponent {

  IsUpdate:boolean=false
  registrationForm!: FormGroup;
  diseasesList: string[] = [
    "Diabetes",
    "High blood Pressure",
    "Low blood Pressure",
    "Skin Allergies",
    "Sugar Craving Body",
    "Chronic kidney disease"
  ];
  bloodGrpList:string[]=['A+','B+','A-','B-','AB+','AB-','O+','O-']
  userIdToUpdate!: number;
  
  constructor(private fb:FormBuilder,private service:ManagemantService,private router:Router,private activatedroute:ActivatedRoute){}

  ngOnInit(){
    this.registrationForm = new FormGroup({
      id:new FormControl(),
      firstName: new FormControl('',Validators.required),
      lastName: new FormControl('',Validators.required),
      email: new FormControl('',Validators.email),
      mobile: new FormControl('',Validators.required),
      weight: new FormControl('',Validators.required),
      height: new FormControl('',Validators.required),
      bmi: new FormControl('',Validators.required),
      bmiResult: new FormControl(''),
      gender: new FormControl('',Validators.required),
      requireSpecialist: new FormControl('',Validators.required),
      bloodGrp: new FormControl('',Validators.required),
      diseasesList: new FormControl(''),
      regularPatient: new FormControl('',Validators.required),
      enquiryDate: new FormControl('',Validators.required)
    });

    this.registrationForm.controls['height'].valueChanges.subscribe(res => {
      this.calculateBmi(res);
      
    });
    
    

    this.activatedroute.params.subscribe((res)=>{
      this.userIdToUpdate=res['id'];
      this.service.getClient(this.userIdToUpdate).subscribe((res)=>{
          this.IsUpdate=true;
          this.registrationForm.setValue(res);
          
      })



    })
  }

  register(){
    if(!this.IsUpdate){
      var d=new Date().getTime().toString();
      this.registrationForm.controls['id'].patchValue(d);

    }
     this.service.register(this.registrationForm.value).subscribe(()=>{});
     
     
     this.router.navigateByUrl('list')
  }
  update(){
    this.service.update(this.registrationForm.value,this.userIdToUpdate).subscribe();
    this.router.navigateByUrl('list')

  }



  calculateBmi(value: number) {
    
    const weight = this.registrationForm.value.weight; // weight in kilograms
    const height = value; // height in meters
    const bmi = weight / (height * height);
    
    this.registrationForm.controls['bmi'].patchValue(bmi);
    
    
  
    switch (true) {
      case bmi < 18.5:
        this.registrationForm.controls['bmiResult'].patchValue("Underweight");
        break;
      case (bmi >= 18.5 && bmi < 25):
        this.registrationForm.controls['bmiResult'].patchValue("Normal");
        break;
      case (bmi >= 25 && bmi < 30):
        this.registrationForm.controls['bmiResult'].patchValue("Overweight");
        break;

      default:
        this.registrationForm.controls['bmiResult'].patchValue("Obese");
        break;
    }
  }
}
