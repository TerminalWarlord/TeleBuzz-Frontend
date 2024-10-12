import { faHandshakeAngle, faUser } from "@fortawesome/free-solid-svg-icons";
import Intro from "../DetailPage/Intro";
import InfoCard from "../DetailPage/LeftSidebar/InfoCard";
import Tabs from "../UI/Tabs";
import Card from "../UI/Card";
import AllReviews from "../DetailPage/AllReviews";
import LineBreak from "../UI/LineBreak";
import Logs from "./Logs";
import Pagination from "../UI/Pagination";
import { fetchItems, getFullUserDetails } from "../../utils/http";
import useFetch from "../../hooks/useFetch";
import { Fragment, useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Profile = () => {
    const params = useParams();
    let user = useSelector(state => state.auth.user);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        if (params.username || user?.result?.username) {
            setUsername(params.username || user?.result?.username);
        }
    }, [params.username, user?.result?.username]);

    const fetchFn = useCallback(async () => {
        if (username) {
            return await getFullUserDetails(username);
        }
        return null;
    }, [username]);

    const { data, isFetching, error } = useFetch(fetchFn, {
        result: {}
    });
    const [currentPage, setCurrentPage] = useState(1);


    const fetchUserContributions = useCallback(async () => {
        return await fetchItems(1, 15, 'popular', 'all', null, null, username);
    }, [username])

    const {
        data: botsData,
        isFetching: isFetchingBots,
        error: botsError,
        setIsFetching: setIsFetchingBots,
        setError: setBotsError,
        setData: setBotsData,
    } = useFetch(fetchUserContributions, {
        result: Array(5).fill(null).map(() => ({
            id: uuidv4()
        }))
    });

    async function handleNext(pageNo) {
        setCurrentPage(pageNo);
        setIsFetchingBots(true);
        try {
            const res = await fetchItems(pageNo, 20);
            setBotsData(res);
        }
        catch (err) {
            setBotsError({
                message: err.message || "Failed to fetch data!"
            });
        }
        setIsFetchingBots(false);
    }

    const tabContent = [
        {
            tabName: 'Contributions',
            content: <div className="w-full flex items-center flex-col">
                <LineBreak icon={faHandshakeAngle} text={'All Contributions'} classes="mt-2 mb-4" />
                <div className='grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-2 2xl:grid-cols-3  sm:gap-x-2 md:gap-x-5'>
                    {botsError?.message && <h4 className="text-center text-red-300 text-lg">Failed to load data!</h4>}
                    {!botsError && (
                        <Fragment>
                            {isFetchingBots
                                ? Array(5).fill(null).map(() => (
                                    <Card key={uuidv4()} isFetching={true} classes='max-h-60' />
                                ))
                                : botsData?.result.map((bot) => (
                                    <Card
                                        key={uuidv4()}
                                        {...bot}
                                        isFetching={false}
                                        classes='max-h-60'
                                    />
                                ))
                            }
                        </Fragment>
                    )}
                </div>
                <div className="w-full">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={botsData?.hasNextPage ? currentPage + 1 : currentPage}
                        onPageChange={handleNext} />
                </div>
            </div>,
            checked: true,
        },
        {
            tabName: 'Reviews',
            content: <div className="w-full flex flex-col justify-center items-center">
                <AllReviews reviewer={username} />
            </div>,
            checked: false
        },
        {
            tabName: 'Logs',
            content: <div className="w-full flex flex-col justify-center items-center">
                <Logs username={username} />
            </div>,
            checked: false
        }
    ];

    const isLoading = isFetching || !username || !data?.result;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                <h2>Error loading profile</h2>
                <p>{error.message}</p>
            </div>
        );
    }

    return (
        <section className="mx-3 md:mx-20 my-5 flex flex-col justify-center overflow-hidden">
            <Intro
                title={`${data.result.first_name} ${data.result.last_name}`}
                type="Profile" icon={faUser}
                isFetching={false} />
            <div className="flex flex-col items-center md:flex-row md:items-start w-full my-4">
                <InfoCard item={{ isUser: true, ...data.result }} isFetching={false} error={null} />
                <div className="flex flex-col items-center w-11/12 mt-4 md:w-3/4 md:mt-0">
                    <Tabs tabContent={tabContent} />
                </div>
            </div>
        </section>
    )
}

export default Profile;