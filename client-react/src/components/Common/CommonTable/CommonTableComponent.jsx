import { Button, TablePagination } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import React, { useId } from "react";
import TablePaginationActions from "../CommonPagination/CommonPaginationComponent";
import "./CommonTable.css";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import PreviewIcon from "@mui/icons-material/Preview";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.white,
		color: theme.palette.common.black,
		fontWeight: 600,
		borderBottom: "2px solid #ccc",
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 16,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));

export default function CommonTableComponent(props) {
	const id = useId();
	const { columnDef, dataSource, onDelete, onView, onEdit } = props;
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	// // Avoid a layout jump when reaching the last page with empty rows.
	// const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};
	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 700 }} aria-label="customized table">
				<TableHead>
					<TableRow>
						<StyledTableCell>STT</StyledTableCell>
						{columnDef.map((col, index) => (
							<StyledTableCell key={id + index}>{col.colName}</StyledTableCell>
						))}
						<StyledTableCell>Hành động</StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{(rowsPerPage > 0 ? dataSource.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : dataSource).map(
						(row, index) => (
							<StyledTableRow key={index}>
								<StyledTableCell key={index}>{++index}</StyledTableCell>
								{columnDef.map((col, index) => (
									<StyledTableCell key={id + index}>
										<span
											dangerouslySetInnerHTML={{ __html: row[col.colDef] }}
											className={
												row.className ? (row.className[col.colDef] ? row.className[col.colDef] : "") : ""
											}></span>
									</StyledTableCell>
								))}
								<StyledTableCell>
									{onView ? (
										<span
											onClick={() => {
												onView(row);
											}}>
											<RemoveRedEyeIcon titleAccess="Chi tiết" className="icon" />
										</span>
									) : null}
									{onEdit ? (
										<span
											onClick={() => {
												onEdit(row);
											}}>
											<EditIcon titleAccess="Chỉnh sửa" className="icon" />
										</span>
									) : null}
									{onDelete ? (
										<span
											onClick={() => {
												onDelete(row);
											}}>
											<ClearIcon titleAccess="Xóa" className="icon" />
										</span>
									) : null}
									{props.actions
										? props.actions.map((action, index) => (
												<span
													onClick={() => {
														action.onClick(row);
													}}>
													<Button size="small" className="mx-1" variant={action.variant || "contained"} color="primary">
														{action.name}
													</Button>
												</span>
										  ))
										: null}
								</StyledTableCell>
							</StyledTableRow>
						),
					)}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
							count={dataSource.length}
							rowsPerPage={rowsPerPage}
							page={page}
							SelectProps={{
								inputProps: {
									"aria-label": "rows per page",
								},
								native: true,
							}}
							className="pagination"
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
							ActionsComponent={TablePaginationActions}
						/>
					</TableRow>
				</TableFooter>
			</Table>
		</TableContainer>
	);
}
