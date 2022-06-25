import React, { createContext } from 'react';

type CreateAnnouncementFormContextType = {
    handleNextStep: () => void,
    handlePrevStep: () => void,
}

export const CreateAnnouncementFormContext = createContext<CreateAnnouncementFormContextType>({
    handleNextStep: () => {},
    handlePrevStep: () => {},
});