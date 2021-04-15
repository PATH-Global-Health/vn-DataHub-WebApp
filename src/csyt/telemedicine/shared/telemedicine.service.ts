import { httpClient } from '@app/utils';

import { Ticket, TicketFile, TicketStatus } from './telemedicine.model';

const getSchedules = async (from: Date, to: Date): Promise<Ticket[]> => {
  const result = await httpClient.get({
    url: (al) => al.csyt.telemedicine.getSchedule,
    params: { from, to },
  });

  return result.data as Ticket[];
};

const getTickets = async (from: Date, to: Date): Promise<Ticket[]> => {
  const result = await httpClient.get({
    url: (al) => al.csyt.telemedicine.getTickets,
    params: { from, to },
  });

  return result.data as Ticket[];
};

const getTicketFileList = async (
  ticketId: Ticket['Id'],
): Promise<TicketFile[]> => {
  const result = await httpClient.get({
    url: (al) => `${al.csyt.telemedicine.getFileList}${ticketId}`,
  });

  return result.data as TicketFile[];
};

const uploadAttachments = async (
  ticketId: number,
  fileList: File[],
  type: number,
): Promise<void> => {
  if (fileList.length > 0) {
    const formData = new FormData();
    fileList.forEach((f) => {
      formData.append(f.name, f, f.name);
    });

    await httpClient.post({
      url: (al) => `${al.csyt.telemedicine.postFiles}${ticketId}`,
      params: { type },
      contentType: 'application/x-www-form-urlencoded',
      data: formData,
    });
  }
};

const updateTicket = async (
  ticketId: Ticket['Id'],
  status: TicketStatus,
  note?: string,
): Promise<void> => {
  await httpClient.post({
    url: (al) => al.csyt.telemedicine.update,
    data: {
      Id: ticketId,
      Status: status,
      Note: note,
    },
  });
};

const downloadAttachment = async (
  attachmentId: number,
  attachmentName: string,
): Promise<void> => {
  const blob = await httpClient.get({
    url: (al) => `${al.csyt.telemedicine.downloadFile}${attachmentId}`,
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(blob.data);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = attachmentName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

const telemedicineService = {
  getSchedules,
  getTickets,
  getTicketFileList,
  uploadAttachments,
  updateTicket,
  downloadAttachment,
};

export default telemedicineService;
