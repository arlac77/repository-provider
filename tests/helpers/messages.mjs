
export function createMessageDestination() {
    const messages = {};
    const messageDestination = {
      info: (...args) => (messages.info = [...args]),
      error: (...args) => (messages.error = [...args]),
      warn: (...args) => (messages.warn = [...args])
    };
  
    return { messageDestination, messages };
  }
  