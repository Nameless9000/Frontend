import { useReducer, useContext, createContext } from 'react';
import { IUserContext } from '../typings';

const UserContext = createContext(null);

const reducer = (_state: any, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case 'SET':
            return action.payload;
        case 'NULLIFY':
            return null;
        default:
            throw new Error(`invalid action: ${action.type}`);
    }
};

export const UserProvider = ({ children }) => {
    const [user, dispatch] = useReducer(reducer, null);

    return (
        <UserContext.Provider value={{ user, dispatch }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext<IUserContext>(UserContext);
