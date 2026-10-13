/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomPagination from "@/components/cui/CustomPagination";
import { CustomSearchBar } from "@/components/cui/CustomSearchBar";
// import { dummyCustomerDatas } from "@/datas/customerData";
import ChefTable from "./ChefTable";
import { myFetch } from "@/utils/myFetch";
import { EUserRole } from "@/enums/userEnums";
import dayjs from "dayjs";



const Chefs = async ({ searchParams }: { searchParams: any }) => {
  const { query, page } = await searchParams;
  //console.log("Chef management : ", query, page)

  const queryParams = new URLSearchParams({
    role: EUserRole.CHEF,
    limit: "20", // must be string
    ...(query ? { searchTerm: query } : {}),
    ...(page ? { page: page.toString() } : {}),
  });

  const resChefs = await myFetch(`/user?${queryParams.toString()}`, {
    method: "GET",
    tags: ['Chefs']
  })

  const chefs = resChefs?.data?.map((item: any) => {
    const rating = item?.avg_rating && Number(item?.avg_rating).toFixed(2)
    return {
      _id: item?._id,
      id: item?.id,
      userId: item?.userId,
      name: item?.name,
      email: item?.email,
      phone: item?.contact,
      area: "10005",
      bookings: item?.total_bookings,
      rating: { score: rating, reviews: item?.total_rating },
      lastBooking: item?.last_booking_date ? dayjs(item?.last_booking_date).format("DD-MMM-YYYY HH:mm A") : "N/A",
    }
  }) || []

  console.log("res Chefs : ", resChefs)

  return (
    <div className="px-8 flex flex-col min-h-[86vh]">
      <div className="flex-1">
        <div className="w-full flex justify-end items-center pt-4">
          <div className='w-60 xl:w-100'>
            <CustomSearchBar placeholder="Search here..." />
          </div>
        </div>
        <div className="pt-2">
          <ChefTable data={chefs} />
        </div>
      </div>
      <div className="pb-8 pt-4">
        <CustomPagination TOTAL_PAGES={resChefs?.pagination?.totalPage} qryName="page" totals={resChefs?.pagination?.total} />
      </div>
    </div>
  )
}

export default Chefs;