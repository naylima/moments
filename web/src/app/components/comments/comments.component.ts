import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';

import { MomentService } from 'src/app/services/moment.service';
import { MessagesService } from 'src/app/services/messages.service';
import { CommentService } from 'src/app/services/comment.service';

import { Moment } from 'src/app/Moment';
import { Comment } from 'src/app/Comment';

import { environment } from 'src/environments/environment';

import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit{
  moment?: Moment
  baseApiUrl = environment.baseApiUrl

  faTimes = faTimes
  faEdit = faEdit

  commentForm!: FormGroup

  constructor(
    private momentService: MomentService,
    private messageService: MessagesService,
    private commentService: CommentService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    
    this.momentService
      .getMoment(id)
      .subscribe(item => this.moment = item.data)
      
    this.commentForm = new FormGroup({
      text: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required])
    })
  }

  get text() {
    return this.commentForm.get('text')
  }

  get username() {
    return this.commentForm.get('username')
  }

  async onSubmit(formDirective: FormGroupDirective) {
    if(this.commentForm.invalid) {
      return
    }

    const data: Comment = this.commentForm.value

    data.momentId = Number(this.moment!.id)

    await this.commentService
      .createComments(data)
      .subscribe(comment => this.moment!.comments!.push(comment.data))

    this.messageService.add('Comentário adicionado!')

    this.commentForm.reset()

    formDirective.resetForm()
  }

  async removeHandler(id: number) {
    await this.commentService
      .removeComment(id)
      .subscribe(comment => 
        this.moment!.comments = this.moment!.comments!.filter(item => item.id !== comment.data.id)
      )

    this.messageService.add('Comentário excluído com sucesso!')
  }
}
