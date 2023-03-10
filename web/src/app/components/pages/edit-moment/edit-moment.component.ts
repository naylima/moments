import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { MomentService } from 'src/app/services/moment.service';
import { MessagesService } from 'src/app/services/messages.service';

import { Moment } from 'src/app/Moment';

@Component({
  selector: 'app-edit-moment',
  templateUrl: './edit-moment.component.html',
  styleUrls: ['./edit-moment.component.css']
})
export class EditMomentComponent implements OnInit{
  moment!: Moment
  btnText: string = 'Editar'

  constructor(
    private momentService: MomentService,
    private messagesService: MessagesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
  
    this.momentService
      .getMoment(id)
      .subscribe(item => this.moment = item.data)
  }

  async editHandler(moment: Moment) {
    const id = this.moment.id

    const formData = new FormData()

    formData.append('title', moment.title)
    formData.append('description', moment.description)

    if(moment.image) {
      formData.append('image', moment.image)
    }

    await this.momentService.updateMoment(id!, formData).subscribe()
    
    this.messagesService.add('Momento editado com sucesso!')
  
    if(this.moment != moment){
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 400);
    }
  }
}
