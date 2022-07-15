import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { ApiService } from '../_services/api.service';
import { Message, ChatService } from '../_services/chat.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private tokenStorage: TokenStorageService,
    private _router: Router,
    private apiService: ApiService,
    public chatService: ChatService
  ) { }

  dropdownList: any[] = [];
  selectedDosage: any[] = [];
  symptomsChecker: boolean = false;
  riskSheet: boolean = false;
  dosagePayload: string = "";


  dropdownSettings: IDropdownSettings = {};

  messages: Message[] = [];
  value: string = ""; // Chat Value 

  form: any = {
    patientName: null,
    medicine: null,
    fromDate: null,
    toDate: null,
    dosage: null,
  };

  symptomsList: string = "";
  symptomsResult: any = [];
  symptomsQues: any = [];

  lowRisk: number = 0;
  mediumRisk: number = 0;
  highRisk: number = 0;

  nextDisabled: boolean = false;
  processDisabled: boolean = false;

  formGetStarted: boolean = false;
  formStatus: any = {
    patientName: false,
    medicineName: false,
    dosage: false,
    fromDate: false,
    toDate: false,
    symptoms: false
  }

  botDosage: boolean = false;
  botFromDate: boolean = false;
  botToDate: boolean = false;
  botSymptoms: boolean = false;

  ngOnInit(): void {
    if (this.tokenStorage.getUser().name == null || this.tokenStorage.getUser().name == undefined) {
      this._router.navigate(['login']);
    }

    this.dropdownList = [
      { id: 1, text: 'Morning' },
      { id: 2, text: 'Afternoon' },
      { id: 3, text: 'Evening' },
      { id: 4, text: 'Night' }
    ];
    this.dropdownSettings = {
      idField: 'id',
      textField: 'text',
    };


    this.apiService.getSymptoms().subscribe(
      (data: any) => {
        this.symptomsQues = data;

      });

    let toggleButton = document.querySelector('.toggle-chat') as HTMLElement;
    let chatPopUp = document.querySelector('.chat-pop-up') as HTMLElement;
    toggleButton.addEventListener('click', function () {
      toggleButton.classList.toggle('chat-is-open');
      chatPopUp.classList.toggle('chat-display-on');
      chatPopUp.classList.toggle('chat-visible');

    });

    this.chatService.conversation.subscribe((val) => {
      this.messages = this.messages.concat(val);
    });

    window.setInterval(function () {
      var elem = document.getElementById('list1') as HTMLElement;
      elem.scrollTop = elem.scrollHeight;
    }, 2000);
  }

  onSubmit(): void {

    this.symptomsChecker = true;
    this.nextDisabled = true;

  }
  reset() {
    this.formGetStarted = false;
    this.formStatus.patientName = false;
    this.formStatus.medicineName = false;
    this.formStatus.dosage = false;
    this.formStatus.fromDate = false;
    this.formStatus.toDate = false;
    this.formStatus.symptoms = false;

    this.form.patientName = null;
    this.form.medicine = null;
    this.form.fromDate = null;
    this.form.toDate = null;
    this.form.dosage = null;
    this.dosagePayload = "";
    this.selectedDosage = [];
    this.symptomsResult = [];
    this.symptomsList = "";
  }

  sendMessage() {
    console.log(this.messages[this.messages.length - 1]);
    console.log(this.value);
    if (this.value.toLowerCase() == "reset" || this.value.toLowerCase() == "exit") {
      this.reset();
      this.chatService.getBotAnswer("reset");
    } else
      if (this.value.toLowerCase() == "start") {
        this.formGetStarted = true;
        this.formStatus.patientName = true;
        this.chatService.getBotAnswer(this.value);

      }
      else if (this.formGetStarted == true && this.formStatus.patientName == true && this.formStatus.medicineName == false) {
        this.formStatus.medicineName = true;
        this.form.patientName = this.value;
        this.chatService.getMedicalBotAnswer(this.value, "medicine");
      }
      else if (this.formGetStarted == true && this.formStatus.medicineName == true && this.formStatus.dosage == false) {
        this.formStatus.dosage = true;
        this.form.medicine = this.value;
        this.botDosage = true;
        this.chatService.getMedicalBotAnswer(this.value, "dosage");
      }
      else if (this.formGetStarted == true && this.formStatus.dosage == true && this.formStatus.fromDate == false) {
        this.formStatus.fromDate = true;
        this.botDosage = false;
        this.botFromDate = true;
        let bottDosage ='';
        this.form.dosage.forEach((element: { text: string; }) => {
          bottDosage += element.text + ",";
        });
        this.chatService.getMedicalBotAnswer(bottDosage, "fromdate");
      }
      else if (this.formGetStarted == true && this.formStatus.fromDate == true && this.formStatus.toDate == false) {
        this.formStatus.toDate = true;
        this.botFromDate = false;
        this.botToDate = true;
        this.chatService.getMedicalBotAnswer(this.form.fromDate, "todate");
      }
      else if (this.formGetStarted == true && this.formStatus.toDate == true && this.formStatus.symptoms == false) {
        this.formStatus.symptoms = true;
        this.botToDate = false;
        this.onSubmit();
        this.botSymptoms = true;
        this.chatService.getMedicalBotAnswer(this.form.toDate, "symptoms");
      }
      else if (this.formGetStarted == true && this.formStatus.symptoms == true) {
        this.botSymptoms = false;
        this.onSubmitSymptoms();
        this.chatService.getMedicalBotAnswer("Report Submitted","end");
        this.reset();
      }
      else {
        this.chatService.getBotAnswer(this.value);
      }

    this.value = '';
  }

  onSubmitSymptoms(): void {
    this.symptomsResult.forEach((element: any) => {
      this.symptomsList += element.symptoms + ",";
    });
    let totalSymptoms = this.symptomsResult.length;
    let lowRisk = 0;
    let mediumRisk = 0;
    let highRisk = 0;
    let lowCount = 0;
    let mediumCount = 0;
    let highCount = 0;
    for (let i = 0; i < totalSymptoms; i++) {
      if (this.symptomsResult[i].severity < 30) {
        lowRisk += this.symptomsResult[i].severity;
        lowCount++;
      } else if (this.symptomsResult[i].severity >= 30 && this.symptomsResult[i].severity < 60) {
        mediumRisk += this.symptomsResult[i].severity;
        mediumCount++;
      } else {
        highRisk += this.symptomsResult[i].severity;
        highCount++;
      }
      if (lowCount > 0) {
        this.lowRisk = parseInt((lowRisk / lowCount).toFixed(2));
      }
      if (mediumCount > 0) {
        this.mediumRisk = parseInt((mediumRisk / mediumCount).toFixed(2));
      }
      if (highCount > 0) {
        this.highRisk = parseInt((highRisk / highCount).toFixed(2));
      }
    }
    this.riskSheet = true;

    let userSymptonsIds: any = "";
    let userSymptonsCallback: boolean = false;
    for (let i = 0; i < this.symptomsResult.length; i++) {
      let userSymptomsPayload = {
        "symptoms_id": this.symptomsResult[i].sym_id,
        "user_id": this.tokenStorage.getUser().user_id
      }
      if (this.symptomsResult.length - 1 == i) {
        this.apiService.saveUserSymptoms(userSymptomsPayload).subscribe(
          (data: any) => {
            userSymptonsIds += data.id;
            this.saveMedicalInfo(userSymptonsIds)
          }, (error: any) => {
            console.error(error);
          });
      } else {
        this.apiService.saveUserSymptoms(userSymptomsPayload).subscribe(
          (data: any) => {
            userSymptonsIds += data.id + ",";
          }, (error: any) => {
            console.error(error);
          });
      }
    }
    this.form.dosage.forEach((element: { text: string; }) => {
      this.dosagePayload += element.text + ",";
    });

    let emailContent = {
      "patientName": this.form.patientName,
      "medicine": this.form.medicine,
      "dosage": this.dosagePayload,
      "symptoms": this.symptomsList,
      "lowRisk": this.lowRisk,
      "mediumRisk": this.mediumRisk,
      "highRisk": this.highRisk
    }

    this.apiService.sendEmail(emailContent).subscribe(
      (data: any) => {
        alert("Email sent successfully");
      }, (error: any) => {
        console.error(error);
      });
  }

  saveMedicalInfo(userSymptonsIds: any) {

    this.form.dosage.forEach((element: { text: string; }) => {
      this.dosagePayload += element.text + ",";
    });

    let saveMedicalInfoPayload = {
      "user_id": this.tokenStorage.getUser().user_id,
      "name": this.form.patientName,
      "dosage": this.dosagePayload,
      "from_date": this.form.fromDate,
      "to_date": this.form.toDate,
      "user_symptoms_ids": userSymptonsIds,
      "low_risk": this.lowRisk,
      "medium_risk": this.mediumRisk,
      "high_risk": this.highRisk,
      "medicine": this.form.medicine
    }


    this.apiService.saveMedicalInfo(saveMedicalInfoPayload).subscribe(
      (data: any) => {
        alert("Successfully saved");
        this.processDisabled = true;
      }
    );

  }

  print() {
    window.print();
  }
  onChange(event: any, symptom: any) {
    if (event.checked) {
      this.symptomsResult.push(symptom);
    } else {
      this.symptomsResult.splice(this.symptomsResult.indexOf(symptom), 1);
    }
  }


  // $("#chat-label").click(function() {

  //   $('#live-chat').toggleClass('open-chat');
  //   $('#chat-label').toggleClass('open-chat-label');
  //   $('.live-chat-up-arrow').toggleClass('hide-up-arrow');
  //   $('.live-chat-down-arrow').toggleClass('show-down-arrow');

  // });


  openChat() {
    let toggleButton = document.querySelector('.toggle-chat') as HTMLElement;
    let chatPopUp = document.querySelector('.chat-pop-up') as HTMLElement;
    toggleButton.addEventListener('click', function () {
      toggleButton.classList.toggle('chat-is-open');
      chatPopUp.classList.toggle('chat-display-on');
      chatPopUp.classList.toggle('chat-visible');
    });
  }

}
