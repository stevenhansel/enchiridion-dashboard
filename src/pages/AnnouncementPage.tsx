import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import CreateAnnouncementForm from '../components/CreateAnnouncementForm';

type Props = {
  children?: React.ReactNode;
};

type Announcement = {
  id: number;
  title: string;
  media: string;
  status: string;
};

const baseUrl = 'https://enchridion-api.stevenhansel.com/dashboard/v1';

const AnnouncementPage = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      if (!isLoading) setIsLoading(true);

      const response = await axios.get(baseUrl + '/announcements');
      const announcements: Announcement[] = response.data.contents.map(
        (data: any) => ({
          id: data.id,
          title: data.title,
          media: data.media,
          status: data.status,
        })
      );

      setAnnouncements(announcements);
      setIsLoading(false);
      console.log();
    } catch (err) {}
  };

  const updateApprovalStatus = async (id: number, approve: boolean) => {
    try {
      await axios.put(baseUrl + `/announcements/${id}/approval`, { approve });
      fetchAnnouncements();
    } catch (err) {}
  };

  const handleSaveAnnouncement = async () => {
    await fetchAnnouncements();
  };

  return (
    <Box>
      <CreateAnnouncementForm onSave={handleSaveAnnouncement} />

      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="right">Title</TableCell>
                  <TableCell align="right">Media</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {announcements.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="right">{row.title}</TableCell>
                    <TableCell align="right">
                      <img src={row.media} alt={row.title} />
                    </TableCell>
                    <TableCell align="right">{row.status}</TableCell>
                    <TableCell style={{ width: '200px' }}>
                      {row.status === 'waiting_for_approval' ? (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '16px',
                          }}
                        >
                          <Button
                            onClick={() => updateApprovalStatus(row.id, true)}
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => updateApprovalStatus(row.id, false)}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default AnnouncementPage;
