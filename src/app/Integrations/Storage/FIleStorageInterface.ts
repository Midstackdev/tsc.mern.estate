export interface FileStorageInterface {
  upload: (path: string) => any;
  destroy: (id: string) => void;
  getResource: (id: string) => any;
}
