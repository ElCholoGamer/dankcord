type Param = ReturnType<typeof URLSearchParams.prototype.get>;

function getWsInfo(url = ''): [token: Param, user: Param] {
	const { searchParams } = new URL(url, 'http://example.com');
	const token = searchParams.get('token');
	const user = searchParams.get('user');

	return [token, user];
}

export default getWsInfo;
