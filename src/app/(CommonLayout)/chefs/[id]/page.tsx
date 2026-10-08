/* eslint-disable @typescript-eslint/no-explicit-any */

import { ChevronRight } from "lucide-react";
import { GoStarFill } from "react-icons/go";
import AvatarImage from "@/components/cui/AvatarImage";
import SingleChefComponent from "./SingleChef";
import { myFetch } from "@/utils/myFetch";
import { formatUrl } from "@/utils/formatUrl";
import BackButton from "@/components/button/BackButton";

const SingleChefPage = async ({ params }: { params: any }) => {
  const { id } = await params;
  //console.log("Single Customer Id : ", id)

  const resChef = await myFetch(`/user/${id}`, {
    method: "GET",
    tags: ['Chef']
  })
  const chefDetails = resChef?.data

  return (
    <div className="pb-4 xl:pb-6">
      <div className="flex justify-between items-center px-4 pb-8">
        <div className="flex items-center gap-3">
          <AvatarImage src={formatUrl(chefDetails?.image)} width={100} height={100} alt="user Logo" className='w-16 h-16 object-cover rounded-full' />
          <div>
            <p className="font-bold text-xl text-gray-800">{chefDetails?.name}</p>
            <p className="flex items-center gap-1 text-gray-600">
              <GoStarFill className="size-6 text-[#FD713F]" />
              {`${chefDetails?.avg_rating} (${chefDetails?.total_rating} Reviews)`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 font-semibold">
          <BackButton>
            <span className="flex items-center text-gray-700">Chefs <ChevronRight className="size-6" /></span>
          </BackButton>
          <span className="text-[#FD713F]">ID {chefDetails?.userId}</span>
        </div>
      </div>
      <SingleChefComponent chefDetails={chefDetails} id={id} />
    </div>
  )
}

export default SingleChefPage;