import { makeAutoObservable, runInAction } from 'mobx';
import { createContext, ReactNode, useContext } from 'react';

interface ITags {
  name:string; 
  isChecked:boolean;
}

class MBXUser {
  user_id = 0;
  username = '';
  email = '';
  isUserAuth = false;
  isLogout = false;
  tagsForFilter:ITags[] = [];

  constructor () {
    makeAutoObservable(this);
  } 

  setTags(tags:ITags[]) {
    this.tagsForFilter = tags;
  }
  
  toChangeStatusFromTag(index: number, status: boolean) {
    runInAction(() => {
      const prevState = [...this.tagsForFilter];
      prevState[index].isChecked = status;
      this.tagsForFilter = prevState;
    })
  }

  setData(data: {username: string, user_id:number, email:string, token: string}) {
    this.isUserAuth = true;
    runInAction(() => {
      this.username = data.username;
      this.email = data.email;
      this.user_id = data.user_id;
      localStorage.setItem("jwtToken", data.token);
    });
  }

  logout() {
    localStorage.removeItem("jwtToken");
    const newUser = new MBXUser();
    newUser.isLogout = true;
    runInAction(() => {
      Object.assign(this, newUser);
    })
  }
}

export type TMBXUser = MBXUser;
const MBXUserContext = createContext<TMBXUser | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const store = new MBXUser();
  return (
    <MBXUserContext value={store}>
      {children}
    </MBXUserContext>
  );
};

export function useUserStore () {
  const context = useContext(MBXUserContext);
  return context!;
};
