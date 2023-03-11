import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('/moments', 'MomentsController').apiOnly()
  Route.post('/moments/:momentId/comments', 'CommentsController.store')

  Route.resource('/comments', 'CommentsController').apiOnly
}).prefix('/api')
