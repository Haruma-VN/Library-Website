import React, { useEffect, useState } from 'react';
import userIcon from '../../assets/icons/user.png';
import categoryIcon from '../../assets/icons/category.png';
import Exception from '../Exception/Exception';
import StackedBarChart from './StackedBarChart';
import Book from '../../model/Book';
import Spinner from '../Spinner/Spinner';
import { getCookie } from 'typescript-cookie';
import Revenue from '../../model/Revenue';
import OrderStatus from '../../model/OrderStatus';
import RevenueChart from './RevenueChart';
import OrderStatusChart from './OrderStatusChart';

const Dashboard: React.FC = () => {
	const [userCount, setUserCount] = useState<number>(0);
	const [adminCount, setAdminCount] = useState<number>(0);
	const [categoryCount, setCategoryCount] = useState<number>(0);
	const [error, setError] = useState<string | null>(null);
	const [books, setBooks] = useState<Array<Book>>([]);
	const [isLoadUser, setIsLoadUser] = useState<boolean>(true);
	const [isLoadAdmin, setIsLoadAdmin] = useState<boolean>(true);
	const [isLoadCategory, setIsLoadCategory] = useState<boolean>(true);
	const [isLoadBook, setIsLoadBook] = useState<boolean>(true);
	const [isLoadRevenue, setIsLoadRevenue] = useState<boolean>(true);
	const [isLoadOrderStatus, setIsLoadOrderStatus] = useState<boolean>(true);
	const [page, setPage] = useState(0);
	const [hasMoreBook, setHasMoreBook] = useState<boolean>(true);
	const [revenueData, setRevenueData] = useState<Array<Revenue>>([]);
	const [orderStatusData, setOrderStatusData] = useState<Array<OrderStatus>>([]);

	useEffect(() => {
		const fetchAdmin = async () => {
			const response = await fetch('http://localhost:3308/api/v1/user/count/ROLE_ADMIN', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${getCookie('accessToken')}`,
				},
			});
			if (!response.ok) {
				throw new Error('Không thể lấy dữ liệu admin');
			}
			return await response.json();
		};
		fetchAdmin()
			.then((e) => setAdminCount(e))
			.catch((e) => setError(e.message))
			.finally(() => setIsLoadAdmin(false));
	}, []);

	useEffect(() => {
		const fetchBooks = async () => {
			const response = await fetch(
				`http://localhost:3308/api/v1/book?page=${page}&limit=10`,
				{
					headers: {
						Authorization: `Bearer ${getCookie('accessToken')}`,
					},
				},
			);
			if (!response.ok) {
				throw new Error('Không thể lấy dữ liệu sách');
			}
			const data = (await response.json()).content as Array<Book>;
			if (data.length === 0) {
				setHasMoreBook(false);
			}
			setBooks([...books, ...data]);
			setPage(page + 1);
		};
		if (hasMoreBook) {
			fetchBooks()
				.catch((e) => setError(e.message))
				.finally(() => setIsLoadBook(false));
		}
	}, [books, hasMoreBook, page]);

	useEffect(() => {
		const fetchCategory = async () => {
			const response = await fetch('http://localhost:3308/api/v1/category/count', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${getCookie('accessToken')}`,
				},
			});
			if (!response.ok) {
				throw new Error('Không thể lấy dữ liệu danh mục');
			}
			return await response.json();
		};
		fetchCategory()
			.then((e) => setCategoryCount(e))
			.catch((e) => setError(e.message))
			.finally(() => setIsLoadCategory(false));
	}, []);

	useEffect(() => {
		const fetchUser = async () => {
			const response = await fetch('http://localhost:3308/api/v1/user/count/ROLE_USER', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${getCookie('accessToken')}`,
				},
			});
			if (!response.ok) {
				throw new Error('Không thể lấy dữ liệu người dùng');
			}
			return await response.json();
		};
		fetchUser()
			.then((e) => setUserCount(e))
			.catch((e) => setError(e.message))
			.finally(() => setIsLoadUser(false));
	}, []);

	useEffect(() => {
		const fetchRevenue = async () => {
			const response = await fetch(
				'http://localhost:3308/api/v1/statistics/revenue-by-date',
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${getCookie('accessToken')}`,
					},
				},
			);
			if (!response.ok) {
				throw new Error('Không thể lấy dữ liệu doanh thu');
			}
			return await response.json();
		};
		fetchRevenue()
			.then((e) => setRevenueData(e))
			.catch((e) => setError(e.message))
			.finally(() => setIsLoadRevenue(false));
	}, []);

	useEffect(() => {
		const fetchOrderStatus = async () => {
			const response = await fetch(
				'http://localhost:3308/api/v1/statistics/orders-by-status',
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${getCookie('accessToken')}`,
					},
				},
			);
			if (!response.ok) {
				throw new Error('Không thể lấy dữ liệu trạng thái đơn hàng');
			}
			return await response.json();
		};
		fetchOrderStatus()
			.then((e) => setOrderStatusData(e))
			.catch((e) => setError(e.message))
			.finally(() => setIsLoadOrderStatus(false));
	}, []);

	if (
		isLoadAdmin ||
		isLoadBook ||
		isLoadCategory ||
		isLoadUser ||
		isLoadRevenue ||
		isLoadOrderStatus
	) {
		return <Spinner />;
	}

	if (error !== null) {
		return <Exception message={error} />;
	}

	return (
		<div className='container mt-4'>
			<h2 className='text-center mb-4'>Chào mừng đến trang chủ admin</h2>
			<div className='row mb-4'>
				<div className='col-md-6'>
					<div className='card shadow-sm rounded-lg h-100'>
						<div className='card-body text-center'>
							<h5 className='card-title mb-4'>Quản lý Người dùng</h5>
							<img
								src={userIcon}
								alt='user'
								width={150}
								height={150}
								className='mb-3'
								style={{
									borderRadius: '50%',
									border: '2px solid #ddd',
									padding: '10px',
								}}
							/>
							<p className='card-text mb-2'>
								<strong>Số lượng admin:</strong> {adminCount}
							</p>
							<p className='card-text mb-2'>
								<strong>Số lượng user:</strong> {userCount}
							</p>
						</div>
					</div>
				</div>
				<div className='col-md-6'>
					<div className='card shadow-sm'>
						<div className='card-body text-center'>
							<h5 className='card-title mb-4'>Quản lý Danh mục</h5>
							<img
								src={categoryIcon}
								alt='user'
								width={150}
								height={150}
								className='mb-3'
								style={{
									borderRadius: '50%',
									border: '2px solid #ddd',
									padding: '10px',
								}}
							/>
							<p className='card-text mb-2'>
								<strong>Số lượng danh mục:</strong> {categoryCount}
							</p>
							<p className='card-text mb-2'>
								<i>Một quyển sách có thể thuộc nhiều danh mục</i>
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className='row mb-4'>
				<div className='col-md-12'>
					<div className='card shadow-sm'>
						<div className='card-body'>
							<h5 className='card-title mb-4'>Quản lý Sách</h5>
							<StackedBarChart
								name={books.map((e) => e.title)}
								data={books.map((e) => [e.quantity, e.price])}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className='row mb-4'>
				<div className='col-md-12'>
					<div className='card shadow-sm'>
						<div className='card-body'>
							<h5 className='card-title mb-4'>Doanh thu</h5>
							<RevenueChart data={revenueData} />
						</div>
					</div>
				</div>
			</div>
			<div className='row'>
				<div className='col-md-12'>
					<div className='card shadow-sm'>
						<div className='card-body'>
							<h5 className='card-title mb-4'>Trạng thái đơn hàng</h5>
							<OrderStatusChart data={orderStatusData} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
