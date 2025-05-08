export interface HelpCenterInterface{
	ID?: number;
	TopicID?: number;
	UserID?: number;
	date?: string;
	subject?: string;
	description?: string;
	image?: string;
	status?: string;
}

export interface TopicsInterface {
  ID: number;
  topic?: string;
  icon?: string;
  
  }

export interface ArticlesInterface {
  ID?: number;
  title: string;
  content: string;
  topic_id: number;
  
  }

  export interface MailBoxInterface {
    ID?: number;
    Date?: string;
    adminresponse?: string;
    UserID?: number;
    HelpCenterStatusID?: number;
    HelpCenterID?: number;
  }	
  
  export interface HelpCenterStatusInterface {
    ID?: number;
    status?: string;

  }

  export interface MessageInterface {
    id: number;
    subject: string;
    description: string;
    date: string;
    Status: string;
    image: string;
    UserName: string
    topic: string;
    adminresponse: string;
    is_read: boolean;
    isResponded: boolean;
  }