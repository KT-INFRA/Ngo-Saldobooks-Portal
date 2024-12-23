import { FileIcon } from './ReactFilesPreview';

export const filePreviewStyle: FileIcon[] = [
  {
    type: 'application/pdf',
    image: 'https://img.icons8.com/color/200/adobe-acrobat--v1.png',
    color: 'red'
  },
  {
    type: 'text/csv',
    image: 'https://img.icons8.com/color/200/csv.png',
    color: 'bg-emerald-600'
  },
  {
    type: 'text/plain',
    image: 'https://img.icons8.com/color/200/document--v1.png',
    color: 'bg-slate-500'
  },
  {
    type: 'application/msword',
    color: 'bg-sky-600'
  },
  {
    image: 'https://img.icons8.com/color/200/microsoft-word-2019--v2.png',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    color: 'bg-sky-600'
  },
  {
    type: 'application/vnd.ms-excel',
    image: 'https://img.icons8.com/color/200/microsoft-excel-2019--v1.png',
    color: 'bg-emerald-600'
  },
  {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    image: 'https://img.icons8.com/color/200/google-sheets.png',
    color: 'bg-emerald-600'
  }
];
