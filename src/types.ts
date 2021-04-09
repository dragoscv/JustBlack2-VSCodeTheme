// Type Information

export interface PickerItem {
    fn(): any
    label: string
    busy?: boolean
    detail?: string
    priority?: number
    alwaysShow?: boolean
    description?: string
}

export enum RegistryState {
    ignored,
    allowed,
    exclude,
}

export type Registry = Record<string, { name: string, state: RegistryState }>;

export interface Script {
    name: string;
    filepath: string;
}

export type GenMsgType = 'showErrorMessage' | 'showInformationMessage' | 'showWarningMessage';
export type GenMsgBtn = Record<string, () => any>;