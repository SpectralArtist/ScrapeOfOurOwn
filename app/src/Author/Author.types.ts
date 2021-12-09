export interface AuthorProps {
    archiveId: string;
    name: string;
}

export interface SearchProps {
    search: string;
}

export const AuthorColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    }
]