import { useState, useEffect } from 'react'
import ModelComment from './ModelComment'
import { Textarea, Button, Box, Grid, Image } from '@mantine/core'
import { Text, Divider, Group, Accordion } from '@mantine/core'

function ModelComments() {
  return <>comments</>
}
// function ModelComments({ model, user_details, image_url, images_url }) {
//   const { user, error } = useUser()
//   const [text, setText] = useState()
//   const [rating, setRating] = useState(0)
//   const [comments, setComments] = useState(model.comments)

//   const today = new Date()
//   const date =
//     today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear()

//   const AddComment = async (e) => {
//     e.preventDefault()
//     const replace_text = text
//     let { data: profile_username, error: username_error } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('id', user.id)

//     const comments = []
//     if (model.comments !== null) {
//       comments = model.comments
//     }
//     const comment = {
//       authur: profile_username[0].username,
//       authur_id: user?.id,
//       date: date,
//       time: today,
//       rating: rating,
//       text: replace_text,
//     }
//     comments.push(comment)
//     const { data: new_comments, error: updatederror } = await supabase
//       .from('iphone')
//       .update({ comments: comments })
//       .eq('model', model.model)

//     if (updatederror) {
//       console.log(updatederror)
//     }
//     images_url.push(image_url)
//     setComments(new_comments[0].comments)
//     setText('')
//     let { data: profiles_comments, error: profiles_comments_error } =
//       await supabase.from('profiles').select('comments').eq('id', user.id)

//     profiles_comments = profiles_comments[0].comments
//     if (profiles_comments_error) {
//       console.log(profiles_comments_error)
//     }
//     if (profiles_comments === null) {
//       profiles_comments = []
//     }
//     const profile_comment = {
//       date: date,
//       model: model.model,
//       title: model.title,
//       time: today,
//       rating: rating,
//       text: replace_text,
//     }
//     profiles_comments.push(profile_comment)
//     const { data, error } = await supabase
//       .from('profiles')
//       .update({ comments: profiles_comments })
//       .eq('id', user.id)
//   }

//   const handleRating = (rate) => {
//     setRating(rate)
//   }

//   return (
//     <Box sx={{ marginBottom: 80 }}>
//       <div>
//         <Text sx={{ fontSize: 28 }} weight={700}>
//           Comment Section
//         </Text>
//         <Text sx={{ fontSize: 18 }} weight={500}>
//           view comments and add your own comment
//         </Text>
//       </div>
//       <Divider sx={{ marginBottom: 20 }} />
//       <Accordion
//         defaultValue='comments'
//         radius='md'
//         styles={{
//           label: { fontSize: 24, fontWeight: 500 },
//         }}>
//         <Accordion.Item value='comments'>
//           <Accordion.Control>Write a Comment</Accordion.Control>
//           <Accordion.Panel>
//             <form onSubmit={AddComment}>
//               <Group position='apart'>
//                 <Group sx={{ padding: 10 }}>
//                   <Image src={image_url} height={45} width={45} radius='xl' />
//                   <div>
//                     <Text size='lg' weight={500}>
//                       {user_details.username}
//                     </Text>
//                     <Text size='xs' weight={400}>
//                       {date}
//                     </Text>
//                   </div>
//                 </Group>
//                 <Group>
//                   <Rating
//                     transition
//                     allowHalfIcon
//                     onClick={handleRating}
//                     ratingValue={rating}
//                   />
//                   <Button type='submit' variant='outline'>
//                     add comment
//                   </Button>
//                   <Button type='reset' variant='outline' color='gray'>
//                     cancel
//                   </Button>
//                 </Group>
//               </Group>
//               <Textarea
//                 minRows={4}
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//               />
//             </form>
//           </Accordion.Panel>
//         </Accordion.Item>
//       </Accordion>
//       <Box sx={{ marginBottom: 120 }}>
//         {comments?.map((comment, index) => (
//           <ModelComment
//             comment={comment}
//             model={model}
//             comments={comments}
//             setComments={setComments}
//             image_url={images_url[index]}
//             user={user}
//             key={index}
//           />
//         ))}
//       </Box>
//     </Box>
//   )
// }

export default ModelComments
