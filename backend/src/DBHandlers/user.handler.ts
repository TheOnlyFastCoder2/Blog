import type { PrismaClient } from "@prisma/client";
import type { UserDTOSubscribe, UserDTOUnsubscribe} from "$/modules/user/user.dto";

export default class UserHandler {
  private readonly db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async toConfirmSubscribe(id:number) {
    try {

      const friend = await this.db.friend.findUnique({
        where: {id}
      }); 

      if(!friend) throw new Error();
   
      await this.db.friend.updateMany({
        where: {
          OR: [
            { user_id: friend.user_id, friend_id:friend.friend_id},
            { user_id: friend.friend_id, friend_id:friend.user_id}
          ]
        } ,
        data: {
          confirm_status: true
        }
      }); 

      await this.db.chat.create({
        data: {
          user_id: friend.user_id,
          friend_id: friend.id,
          created_at: new Date(),
        }
      });

    } catch (error) {
      console.error(`Failed to confirm the subscribe: ${error}`)
      return [
        new Array('Failed to confirm the subscribe'),
        400
      ]
    }
  }

  async toSubscribe({ user_id, stranger_id }: UserDTOSubscribe) {
    try {
      const existingFriendship = await this.db.friend.findFirst({
        where: {
          OR: [
            { user_id: user_id, friend_id: stranger_id },
            { user_id: stranger_id, friend_id: user_id }
          ]
        }
      });
  
      if (existingFriendship) {
        await this.db.friend.updateMany({
          where: {
            OR: [
              { user_id: user_id, friend_id: stranger_id },
              { user_id: stranger_id, friend_id: user_id }
            ]
          },
          data: {
            confirm_status: false,
            sender_id: user_id
          }
        });
      } else {
        await this.db.friend.create({
          data: {
            user_id: user_id,
            friend_id: stranger_id,
            sender_id: user_id,
            confirm_status: false,
            created_at: new Date(),
          }
        });
  
        await this.db.friend.create({
          data: {
            user_id: stranger_id,
            friend_id: user_id,
            sender_id: user_id,
            confirm_status: false,
            created_at: new Date(),
          }
        });
      }
  
    } catch (error) {
      console.error(`Failed to subscribe: ${error}`);
      return [
        new Error("Failed to subscribe"),
        400,
      ];
    }
  }

  async toUnsubscribe({id, user_id, friend_id}: UserDTOUnsubscribe) {
    try {
      let [friend_1, friend_2] = await this.db.friend.findMany({
        where: {
          OR: [
            {user_id, friend_id},
            {friend_id:user_id, user_id:friend_id}
          ]
        }
      })
      const chat = await this.db.chat.findFirst({
        where: {
          OR: [
            {friend_id: friend_1.id},
            {friend_id: friend_2.id}
          ],
        },
        include: {
          friend: true,
          user: true
        }
      })

      const id = friend_2.user_id != user_id ? friend_1.id : friend_2.id;
      const userId = friend_2.user_id == user_id ? friend_1.user_id : friend_2.user_id;
      friend_1 = await this.db.friend.update({
        where: {id: id},
        data: {
          confirm_status: false,
          sender_id: userId,
        }
      })

      if(chat) {
        if(
          friend_2.confirm_status === false  || 
          friend_1.confirm_status === false
        ) {
          await this.db.message.deleteMany({
            where: {chat_id: chat.id},
          });
          
          await this.db.chat.delete({
            where: {id: chat.id},
          });
        }
      }
      
      await this.db.friend.updateMany({
        where: {
          OR: [
            {id: friend_1.id},
            {id: friend_2.id}
          ]
        },
        data: {
          sender_id: userId,
          confirm_status: false,
        }
      })

      if(
        friend_2.confirm_status === false  &&
        friend_1.confirm_status === false
      ) {
        await this.db.friend.deleteMany({
          where: {
            OR: [
              {id: friend_1.id},
              {id: friend_2.id}
            ]
          }
        })
      }
    
    } catch (error) {
      console.error(`Failed to unsubscribe: ${error}`);
      return [
        new Error("Failed to unsubscribe"),
        400,
      ]
    }
  }

  async getNotFriends(user_id:number) {
    try {
      const friends = await this.db.friend.findMany({
        where: {
          OR: [
            { user_id},
            { friend_id: user_id},
          ],
   
        },
        include: {
          user: true,
          friend: true,
        }
      });
 
      const friendIds = friends.reduce<number[]>((acc, friend) => {
        acc.push(friend.friend_id);
        acc.push(friend.user_id);
        return acc;
      }, []);
      
      const notFriends = await this.db.user.findMany({
        where: {
          id: {
            notIn: friendIds,
            not: user_id,
          },
        },

        select: {
          id: true,
          username: true,
          created_at: true,
        }
      });

      return notFriends;
    } catch (error) {
      console.error(`Failed to get a not friends: ${error}`)
      return [
        new Error("Failed to get a not friends:"),
        500
      ];
    }
  }

  async getFriends(user_id:number, confirm_status: boolean) {
    try {
      const friends = await this.db.friend.findMany({
        where: {
          confirm_status: confirm_status,
          user_id
        },
        include: {
          user: true,
          friend: true,
        }
      });

      return friends.map((props) => ({
        ...props,
        friend_name: props.friend.username,
      }));

    } catch (error) {
      console.error(`Failed to get a friends: ${error}`)
      return [
        new Error("Failed to get a friends:"),
        500
      ]; 
    }
  }
}