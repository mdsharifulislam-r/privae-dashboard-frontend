/* eslint-disable @typescript-eslint/no-explicit-any */
// import { dymmySingleBookingData } from "@/datas/bookingData";
// import SingleBooking from "./SingleBooking";
import { ChevronRight } from "lucide-react";
import { GoStarFill } from "react-icons/go";
import AvatarImage from "@/components/cui/AvatarImage";
import SingleCustomerComponent from "./SingleCustomer";
import { myFetch } from "@/utils/myFetch";
import { formatUrl } from "@/utils/formatUrl";
import BackButton from "@/components/button/BackButton";

const SingleBookingPage = async ({ params }: { params: any }) => {
  const { id } = await params;

  const resCustomer = await myFetch(`/user/${id}`, {
    method: "GET",
    tags: ['Customer']
  })
  const customerDetails = resCustomer?.data || {}



  return (
    <div className="pb-4 xl:pb-6">
      <div className="flex justify-between items-center px-4 pb-8">
        <div className="flex items-center gap-3">
          <AvatarImage src={formatUrl(customerDetails?.image)} width={100} height={100} alt="user Logo" className='w-16 h-16 object-cover rounded-full' />
          <div>
            <p className="font-bold text-xl text-gray-800">{customerDetails?.name}</p>
            <p className="flex items-center gap-1 text-gray-600">
              <GoStarFill className="size-6 text-[#FD713F]" />
              {`${customerDetails?.avg_rating} (${customerDetails?.total_rating} Reviews)`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 font-semibold">
          <BackButton>
            <span className="flex items-center text-gray-700">Customers <ChevronRight className="size-6" /></span>
          </BackButton>
          <span className="text-[#FD713F]">ID {customerDetails?.userId}</span>
        </div>
      </div>
      <SingleCustomerComponent customerDetails={customerDetails} id={id} />
    </div>
  )
}

export default SingleBookingPage;