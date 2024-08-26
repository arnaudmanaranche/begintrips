import { unsplash } from './client'

export const getRandomImageCover = async ({
  destination,
}: {
  destination: string
}) => {
  const result = await unsplash.photos.getRandom({
    query: destination,
    orientation: 'landscape',
    count: 1,
  })

  return Array.isArray(result.response)
    ? result.response[0]?.urls?.regular
    : (result.response?.urls?.regular ?? '')
}
