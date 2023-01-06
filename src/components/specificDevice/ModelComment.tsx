import { Paper, Group, Text, ActionIcon, Tooltip, Image } from '@mantine/core'
import { IconTrash, IconPencil, IconCornerUpLeft } from '@tabler/icons'
import { useEffect, useState } from 'react'
//import { Rating } from 'react-simple-star-rating'
//switch for mantine starts rating

function ModelComment() {
  return <>comment</>
}
// function ModelComment({
//   comment,
//   model,
//   comments,
//   setComments,
//   image_url,
//   user,
// }) {
//   const rating = comment.rating / 10 / 2

//   const DeleteComment = async () => {
//     let new_comments = GetNewComments(comments)
//     const { data, error } = await supabase
//       .from('iphone')
//       .update({ comments: new_comments })
//       .eq('model', model.model)

//     let { data: profiles_comments, error: profiles_comments_error } =
//       await supabase.from('profiles').select('comments').eq('id', user?.id)
//     profiles_comments = profiles_comments[0].comments
//     profiles_comments = GetNewComments(profiles_comments)
//     const { data: profile_update, error: profile_update_error } = await supabase
//       .from('profiles')
//       .update({ comments: profiles_comments })
//       .eq('id', user?.id)

//     setComments(new_comments)
//   }

//   function GetNewComments(comments) {
//     let new_comments = []
//     for (let i = 0; i < comments.length; i++) {
//       if (comments[i].time !== comment.time) {
//         new_comments.push(comments[i])
//       }
//     }
//     return new_comments
//   }

//   return (
//     <Paper withBorder radius='md' sx={{ padding: 10, marginTop: 20 }}>
//       <Group position='apart' sx={{ marginBottom: 10 }}>
//         <Group sx={{ padding: 10 }}>
//           <Image
//             src={image_url}
//             height={45}
//             width={45}
//             style={{ borderRadius: '50%' }}
//             alt={comment.authur}
//             radius='xl'
//           />
//           <div>
//             <Text size='lg' weight={500}>
//               {comment.authur}
//             </Text>
//             <Text size='xs' weight={400}>
//               {comment.date}
//             </Text>
//           </div>
//         </Group>
//         <Group sx={{ padding: 10 }}>
//           <Rating initialValue={rating} transition readonly allowHalfIcon />
//           <Tooltip label='reply'>
//             <ActionIcon color='dark'>
//               <CornerUpLeft />
//             </ActionIcon>
//           </Tooltip>
//           {comment?.authur_id === user?.id ? (
//             <>
//               <Tooltip label='edit'>
//                 <ActionIcon color='dark'>
//                   <Pencil />
//                 </ActionIcon>
//               </Tooltip>
//               <Tooltip label='delete'>
//                 <ActionIcon color='dark' onClick={DeleteComment}>
//                   <Trash />
//                 </ActionIcon>
//               </Tooltip>
//             </>
//           ) : (
//             ''
//           )}
//         </Group>
//       </Group>
//       <Text>{comment.text}</Text>
//     </Paper>
//   )
// }

export default ModelComment
