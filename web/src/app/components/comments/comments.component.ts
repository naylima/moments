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
  commentData!: Comment
  baseApiUrl = environment.baseApiUrl

  faTimes = faTimes
  faEdit = faEdit

  commentForm!: FormGroup

  isEditing: boolean = false
  id: number = 0

  constructor(
    private momentService: MomentService,
    private messagesService: MessagesService,
    private commentService: CommentService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    
    this.momentService
      .getMoment(id)
      .subscribe(item => this.moment = item.data)
      
    this.commentForm = new FormGroup({
      text: new FormControl(this.commentData ? this.commentData.text : '', [
        Validators.required
      ]),
      username: new FormControl(this.commentData ? this.commentData.username :'', [
        Validators.required
      ])
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

    this.messagesService.add('Comentário adicionado!')

    this.commentForm.reset()

    formDirective.resetForm()
  }

  async editHandler(formDirective: FormGroupDirective) {
    if(this.commentForm.get('text')?.invalid) {
      return
    }

    const id = this.id

    const data: Comment = this.commentForm.value

    data.username = this.commentData?.username
    data.momentId = Number(this.moment!.id)

    await this.commentService
      .updateComment(id!, data)
      .subscribe()
    
    this.ngOnInit()

    this.messagesService.add('Comentário editado com sucesso!')
    this.isEditing = false

    this.commentForm.reset()
    formDirective.resetForm()
  }

  async removeHandler(id: number) {
    await this.commentService
      .removeComment(id)
      .subscribe(comment => 
        this.moment!.comments = this.moment!.comments!.filter(item => item.id !== comment.data.id)
      )

    this.messagesService.add('Comentário excluído com sucesso!')
  }

  onEdit(comment: Comment) {
    this.isEditing = !this.isEditing
    this.commentData = comment
    this.id = comment.id!
    this.ngOnInit()
  }
}
