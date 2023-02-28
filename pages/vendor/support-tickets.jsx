import { Delete, Edit } from "@mui/icons-material";
import { Box, Card, Stack, Table, TableContainer } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import Scrollbar from "components/Scrollbar";
import SearchInput from "components/SearchInput";
import useMuiTable from "hooks/useMuiTable";
import { StatusWrapper, StyledTableRow, StyledTableCell, StyledIconButton } from "pages-sections/admin";
import api from "utils/__api__/ticket";
const tableHeading = [{
  id: "title",
  label: "문의",
  align: "left"
}, {
  id: "type",
  label: "유형(대)",
  align: "left"
}, {
  id: "category",
  label: "유형(소)",
  align: "left"
},{
  id: "date",
  label: "업로드 날짜",
  align: "left"
},  {
  id: "action",
  label: "수정/삭제",
  align: "center"
}];

// =============================================================================
SupportTickets.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// =============================================================================

// =============================================================================

export default function SupportTickets({
  ticketList
}) {
  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort
  } = useMuiTable({
    listData: ticketList,
    defaultSort: "date"
  });
  return <Box py={4}>
      <SearchInput placeholder="Search Ticket.." sx={{
      mb: 4
    }} />

      <Card>
        <Scrollbar>
          <TableContainer sx={{
          minWidth: 800
        }}>
            <Table>
              <TableHeader order={order} hideSelectBtn orderBy={orderBy} heading={tableHeading} rowCount={ticketList.length} numSelected={selected.length} onRequestSort={handleRequestSort} />

              <TableBody>
                {filteredList.map((ticket, index) => <StyledTableRow role="checkbox" key={index}>
                    <StyledTableCell align="left">
                      {ticket.title}
                    </StyledTableCell>

                    <StyledTableCell align="left">
                      <StatusWrapper status={ticket.type}>
                        {ticket.type}
                      </StatusWrapper>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {ticket.category}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {ticket.date}
                    </StyledTableCell>


                    <StyledTableCell align="center">
                      <StyledIconButton>
                        <Edit />
                      </StyledIconButton>
                      <StyledIconButton>
                        <Delete />
                      </StyledIconButton>
                    </StyledTableCell>
                  </StyledTableRow>)}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination onChange={handleChangePage} count={Math.ceil(ticketList.length / rowsPerPage)} />
        </Stack>
      </Card>
    </Box>;
}
export const getStaticProps = async () => {
  const ticketList = await api.getTicketList();
  return {
    props: {
      ticketList
    }
  };
};