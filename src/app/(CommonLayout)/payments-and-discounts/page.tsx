/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomPagination from "@/components/cui/CustomPagination";
// import BookingTable from "./BookingTable";
// import { dummyBookingDatas } from "@/datas/bookingData";
import { CustomSearchBar } from "@/components/cui/CustomSearchBar";
import CustomStep from "@/components/cui/CustomStep";
import { StepDataType } from "@/types/type";
import Payment from "./Payment";
// import { dummyTransactionDatas } from "@/datas/transactionData";
import Discount from "./Discount";
// import { dummyDiscountDatas } from "@/datas/discountData";
import { myFetch } from "@/utils/myFetch";
import dayjs from "dayjs";

const stepDatas: StepDataType[] = [
  { id: 1, title: "Transactions" },
  { id: 2, title: "Discounts" },
];



const PaymentAndDiscounts = async ({ searchParams }: { searchParams: any }) => {
  const { query, step, page } = await searchParams;
  //console.log("Payment And Discounts : ", query, page, step)

  const queryParamsTransaction = new URLSearchParams({
    limit: "18",
    ...(query ? { searchTerm: query } : {}),
    ...(page ? { page: page.toString() } : {}),
  });

  const resTransactions = await myFetch(`/transaction?${queryParamsTransaction.toString()}`, {
    method: "GET",
    tags: ['transactions']
  })

  const transactions = resTransactions?.data?.map((item: any) => {
    return {
      _id: item?._id,
      id: item?.order_id,
      type: item?.type,
      name: item?.user?.name,
      amount: item?.total,
      time: "02:15",
      hourlyRate: 40.00,
      grossMargin: 18.00,
      status: item?.status
    }
  }) || []


  const queryParamsDiscount = new URLSearchParams({
    limit: "18",
    ...(page ? { page: page.toString() } : {}),
  });

  const resDiscounts = await myFetch(`/coupon?${queryParamsDiscount.toString()}`, {
    method: "GET",
    tags: ['discounts']
  })

  const discounts = resDiscounts?.data?.map((item: any) => {
    let typeValue = "0";
    if (item?.type === "percentage" && item?.discount) {
      typeValue = `${item.discount}%`
    } else if (item?.type === "fixed" && item?.amount) {
      typeValue = `$${item?.amount}`
    }

    return {
      id: item?._id,
      code: item?.custom_code,
      type: typeValue,
      appliesTo: item?.eligible_for,
      minimumOrder: 100.00,
      usage: { used: 34, total: 100 },
      status: item?.status,
      validUntil: dayjs(item?.expiry).format("DD-MMM-YYYY"),
      createdBy: item?.name
    }
  }) || []

  //console.log("Transactions Data : ", resTransactions)
  //console.log("Discounts Data : ", resDiscounts)

  return (
    <div className="px-8 flex flex-col min-h-[86vh]">
      <div className="flex-1">
        <div className="w-full flex justify-between items-center pt-4">
          <CustomStep stepDatas={stepDatas} status="step" />
          {step === "Transactions" && <div className='w-60 xl:w-100'>
            <CustomSearchBar placeholder="Search here..." />
          </div>}
        </div>
        <div className="pt-2">
          {step === "Discounts" ? <Discount data={discounts} /> : <Payment data={transactions} />}
        </div>
      </div>
      <div className="pb-8 pt-4">
        <CustomPagination TOTAL_PAGES={step === "Discounts" ? resDiscounts?.pagination?.totalPage : resTransactions?.pagination?.totalPage} qryName="page" totals={step === "Discounts" ? resDiscounts?.pagination?.total : resTransactions?.pagination?.total} />
      </div>
    </div>
  )
}

export default PaymentAndDiscounts;