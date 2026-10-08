/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomPagination from "@/components/cui/CustomPagination";
import BookingTable from "./BookingTable";
// import { dummyBookingDatas } from "@/datas/bookingData";
import { CustomSearchBar } from "@/components/cui/CustomSearchBar";
import CustomStep from "@/components/cui/CustomStep";
import { StepDataType } from "@/types/type";
import { myFetch } from "@/utils/myFetch";

const stepDatas: StepDataType[] = [
  { id: 1, title: "All" },
  { id: 2, title: "Awaiting Confirmation" },
  { id: 3, title: "Confirm" },
  { id: 4, title: "Decline" },
  { id: 5, title: "Completed" },
  { id: 6, title: "Canceled" },
];

// export enum ORDER_STATUS {
//   AWAITING_CONFIRMATION = 'Awaiting Confirmation',
//   CONFIRM = 'Confirm',
//   DECLINE = 'Decline',
//   CANCELED = 'Canceled',
//   COMPLETED = 'Completed',
// }



const Bookings = async ({ searchParams }: { searchParams: any }) => {
  const { query, bookingStatus, page } = await searchParams;
  // console.log("Booking management : ", query, bookingStatus, page)

  let status = bookingStatus
  if (bookingStatus === "All") {
    status = "";
  }

  const queryParams = new URLSearchParams({
    limit: "20",
    ...(status ? { status: status } : {}),
    ...(query ? { searchTerm: query } : {}),
    ...(page ? { page: page.toString() } : {}),
  });

  const resBookings = await myFetch(`/order?${queryParams.toString()}`, {
    method: "GET",
    tags: ['Bookings']
  })


  const bookings = resBookings?.data?.map((item: any) => {
    return {
      _id: item?._id,
      id: item?.order_id,
      order_id: item?.order_id,
      status: item?.status,
      dateTime: item?.deadline,
      chef: item?.chef?.name,
      customer: item?.user?.name,
      area: "",
      items: 5,
      estimatedTime: item?.duration,
      actualTime: null,
      rate: item?.rating,
      updated: item?.updatedAt,
    }
  }) || []

  // console.log("resBookings : ", resBookings)

  return (
    <div className="px-8 flex flex-col min-h-[86vh]">
      <div className="flex-1">
        <div className="w-full flex justify-between items-center pt-4">
          <CustomStep stepDatas={stepDatas} status="bookingStatus" />
          <div className='w-60 xl:w-100'>
            <CustomSearchBar placeholder="Search by Order ID..." />
          </div>
        </div>
        <div className="pt-2">
          <BookingTable data={bookings} />
        </div>
      </div>
      <div className="pb-8 pt-4">
        <CustomPagination TOTAL_PAGES={resBookings?.pagination?.totalPage} qryName="page" totals={resBookings?.pagination?.total} />
      </div>
    </div>
  )
}

export default Bookings;