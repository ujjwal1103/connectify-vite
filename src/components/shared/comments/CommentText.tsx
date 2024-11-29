import UsernameLink from "../UsernameLink"

export const CommentText = ({
    comment,
    mentions,
  }: {
    comment: string
    mentions: any
  }) => {
    const highlightMentions = () => {
      if (!mentions || mentions.length === 0) {
        return comment
      }
  
      const words = comment?.split(' ')
  
      const highlightedText = words.map((word: string, index: number) =>
        mentions.includes(word) ? (
          <>
            <UsernameLink key={index} username={word} className="text-blue-500">
              <span>{word}</span>
            </UsernameLink>
          </>
        ) : (
          word + ' '
        )
      )
  
      return <>{highlightedText}</>
    }
  
    return <span>{highlightMentions()}</span>
  }