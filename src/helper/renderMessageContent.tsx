
export const renderMessageContent = (content: string, onJoinClick?: (roomId: string) => void) => {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  const parts = content.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      const href = part.startsWith('http') ? part : `https://${part}`;
      
      const isJoinLink = href.includes(`${window.location.origin}/join/`);

      return (
        <a
          key={index} 
          href={href} 
          target={isJoinLink ? "_self" : "_blank"} 
          rel="noopener noreferrer" 
          style={{ color: '#60a5fa', textDecoration: 'underline', wordBreak: 'break-all', cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            if (isJoinLink) {
              e.preventDefault(); 
              const roomId = href.split('/join/')[1];
              if (onJoinClick && roomId) {
                onJoinClick(roomId);
              }
            }
          }} 
        >
          {part}
        </a>
      );
    }
    return part;
  });
};