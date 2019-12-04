
const imagesReducer = (state = [], action) => {
  switch(action.type) {
    case 'ADD_IMAGE':
      return [...state, action.data]
    case 'CLEAR_IMAGES':
      return []
    default:
      return state
  }
}

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

export const addImage = (content) => {
  console.log("Cont", content)
  return {
    type: 'ADD_IMAGE',
    data: {
      image_data: content.image_data,
      id: generateId()
    }
  }
}

export const clearImages = (content) => {
  return {
    type: 'CLEAR_IMAGES'
  }
}

export default imagesReducer
