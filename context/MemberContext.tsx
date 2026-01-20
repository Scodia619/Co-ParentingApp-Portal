import { Member } from '@/types/member';
import React, { createContext, ReactNode, useContext, useState } from 'react';

type MemberContextType = {
  member: Member | null;
  setMember: (member: Member) => void;
};

const MemberContext = createContext<MemberContextType>({
  member: null,
  setMember: () => {},
});

export const MemberProvider = ({ children }: { children: ReactNode }) => {
  const [member, setMember] = useState<Member | null>(null);

  return (
    <MemberContext.Provider value={{ member, setMember }}>
      {children}
    </MemberContext.Provider>
  );
};

export const useMember = () => useContext(MemberContext);
