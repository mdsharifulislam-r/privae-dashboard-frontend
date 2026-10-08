/* eslint-disable @typescript-eslint/no-explicit-any */
// import CustomPagination from "@/components/cui/CustomPagination";
// import BookingTable from "./BookingTable";
// import { dummyBookingDatas } from "@/datas/bookingData";
import CustomStep from "@/components/cui/CustomStep";
import { StepDataType } from "@/types/type";
import AccessComponent from "./Access";
// import { dummyAccessDatas } from "@/datas/accessDatas";
import Settings from "./Settings";
import PlatformFees from "./PlatformFees";
import TermsAndConditions from "./TermsAndConditions";
import PrivacyPolicy from "./PrivacyPolicy";
import { myFetch } from "@/utils/myFetch";
// import TermsAndCondition from "./TemrsAndCondition";
// import CustomJodit from "@/components/cui/CustomJodit";

const stepDatas: StepDataType[] = [
  { id: 1, title: "Access" },
  { id: 2, title: "Platform Rules" },
  { id: 3, title: "Settings" },
  { id: 4, title: "T&Cs" },
  { id: 5, title: "Privacy" },
];



const AdminPage = async ({ searchParams }: { searchParams: any }) => {
  const { step } = await searchParams;

  const resAccess = await myFetch(`/admin`, {
    method: "GET",
    tags: ['Access']
  })


  const access = resAccess?.data?.map((item: any) => {
    return {
      id: item?._id,
      name: item?.name,
      email: item?.email,
      role: item?.role,
      status: item?.status,
      lastActivity: item?.createdAt,
      image: item?.image
    }
  })

  return (
    <div className="px-8 flex flex-col min-h-[86vh]">
      <div className="flex-1">
        <div className="w-full flex justify-between items-center pt-4">
          <CustomStep stepDatas={stepDatas} status="step" />
          <div className='w-60 xl:w-100'>
            {/* <CustomSearchBar placeholder="Search here..." /> */}
          </div>
        </div>
        <div className="pt-2">
          {step === "Access" && <AccessComponent data={access} />}
          {step === "Settings" && <Settings />}
          {step === "Platform Rules" && <PlatformFees />}
          {step === "T&Cs" && <TermsAndConditions />}
          {step === "Privacy" && <PrivacyPolicy />}
        </div>
      </div>
      {/* <CustomPagination TOTAL_PAGES={5} qryName="page" /> */}
    </div>
  )
}

export default AdminPage;