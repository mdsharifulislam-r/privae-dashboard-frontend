/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { CustomModal } from "@/components/cui/CustomModal";
import Image from "next/image";
import CustomTable from "@/components/table/CustomTable";
import CustomTable2 from "@/components/table/CustomTable2";
import { RowString } from "@/components/table/tableRow";
// import { dummyBookingDatas } from "@/datas/bookingData";
// import { dummyMenusData } from "@/datas/menuData";
// import { dummyNoteDatas } from "@/datas/noteData";
// import { dummyReviewDatas } from "@/datas/reviewData";
import { bookingColumns } from "@/tableColumns/bookingColumns";
import { menuColumns } from "@/tableColumns/menuColumns";
import { reviewColumns } from "@/tableColumns/reviewColumns";
import { IBooking, IMenu, INotes, IReview } from "@/types/columnTypes";
import { X } from "lucide-react";
import Link from "next/link";
import EditChef from "./EditChef";
import { myFetch } from "@/utils/myFetch";
import { revalidate } from "@/helpers/revalidateHelper";
import { noteColumnsChef } from "@/tableColumns/noteColumnsChef";
import dayjs from "dayjs";
import { formatUrl } from "@/utils/formatUrl";
import { closedCustomModal } from "@/helpers/closedCustomModal";
import { toast } from "sonner";


export default function SingleChefComponent({ chefDetails, id }: { chefDetails: any, id: string }) {
  // const data: any = dummyBookingDatas;
  // const reviewData: any = dummyReviewDatas;
  // const noteData: any = dummyNoteDatas;
  // const menuData: any = dummyMenusData;

  const bookingHistory = chefDetails?.bookingHistory?.map((item: any) => {
    return {
      id: item._id,
      order_id: item?.order_id,
      status: item.status,
      dateTime: item.formatted_date,
      chef: item.chef.name,
      customer: item.user.name,
      area: "10001",
      items: 1,
      estimatedTime: item.duration,
      actualTime: null,
      rate: item.total_price,
      updated: item.formatted_date
    }
  });

  const reviews = chefDetails?.reviews?.map((item: any) => {
    return {
      id: item._id,
      dateTime: item.createdAt,
      chef: item.chef.name,
      averageRating: item.rating,
      kitchenReadiness: item?.kitchen_readiness,
      communication: item?.communication,
      reviewText: item.review
    }
  });

  const notes = chefDetails?.adminNotes?.map((item: any) => {
    return {
      id: item?._id,
      updatedAt: item?.updatedAt,
      author: "Max Mustermann",
      note: item?.note
    }
  });

  const menus = chefDetails?.menus?.map((item: any) => {
    return {
      id: item?._id,
      title: item?.name,
      menuSection: item?.menu_section,
      dietType: item?.diet_types || [],
      allergens: item?.alergens || [],
      ingredients: item?.ingradients?.length || 0,
      prepTime: item?.est_prep_time,
      cookTime: item?.est_cooking_time
    }
  }) || [];

  //console.log("Chef menu : ", menus)

  const blockUnblock = async () => {
    const res = await myFetch(`/user/block-unblock-user/${id}`, { method: "PATCH" });
    //console.log("Block/Unblock User Res : ", res);
    if (res?.success) {
      revalidate("Chef");
      // toast.success(res?.message);
    }
  }

  const handleApprove = async () => {
    toast.loading("Verifying chef...", { id: "verifyChef" });
    try {
      const res = await myFetch(`/user/verify-chef/${id}`, { method: "PATCH" });
      if (res?.success) {
        toast.success(res?.message || "Chef verified successfully", { id: "verifyChef" });
        revalidate("Chef");
        closedCustomModal();
      } else {
        toast.error(res?.message || "Failed to verify chef", { id: "verifyChef" });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to verify chef", { id: "verifyChef" });
    }
  }

  return (
    <div className="space-y-10 ps-4 xl:ps-6">
      {/* Profile */}
      <div>
        <p className="font-bold text-xl text-gray-800">Profile</p>
        <table className="text-sm text-left text-gray-600">
          <tbody>
            <RowString label="Chef ID" value={chefDetails?.userId} />
            <RowString label="Member since" value={dayjs(chefDetails?.createdAt).format("DD-MMM-YYYY")} />
            <RowString label="Email" value={chefDetails?.email} />
            <RowString label="Phone" value={chefDetails?.contact} />
            <RowString label="Badge" value={chefDetails?.role} />
            <RowString label="Experience" value={chefDetails?.experience} />
            <RowString label="Location" value={chefDetails?.address} />
            <RowString label="Service Area" value={chefDetails?.cooking_area_distance} />
          </tbody>
        </table>
      </div>
      {/* Rates */}
      <div>
        <p className="font-bold text-xl text-gray-800">Rates</p>
        <table className="text-sm text-left text-gray-600">
          <tbody>
            <RowString label="Standard Rate" value="$40.00" />
            <RowString label="Weekend Rate" value="-" />
            <RowString label="Weekday Rate" value="$30.00" />
            <RowString label="Weekday Rate Time" value="9:00 AM to 4:00 PM" />
          </tbody>
        </table>
      </div>
      {/* Booking History */}
      <div>
        <p className="font-bold text-xl text-gray-800">Booking History</p>
        <div className="ps-4">
          <CustomTable<IBooking> columns={bookingColumns} data={bookingHistory} />
        </div>
      </div>
      {/* Menus */}
      <div>
        <p className="font-bold text-xl text-gray-800">Menus</p>
        <div className="ps-4">
          <CustomTable<IMenu> columns={menuColumns} data={menus} />
        </div>
      </div>
      {/* Reviews */}
      <div>
        <p className="font-bold text-xl text-gray-800">Reviews</p>
        <div className="ps-4">
          <CustomTable<IReview> columns={reviewColumns} data={reviews} />
        </div>
      </div>
      {/* Internal Notes */}
      <div>
        <p className="font-bold text-xl text-gray-800">Internal Notes</p>
        <div className="ps-4">
          <CustomTable2<INotes> columns={noteColumnsChef} data={notes} />
        </div>
      </div>
      {/* Actions */}
      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={blockUnblock} className="flex items-center gap-1 bg-[#F2F2F2] rounded-full px-4 py-1 text-red-500 text-sm cursor-pointer">
          <X size={20} />
          {chefDetails?.status === "delete" ? "Unblock" : "Block"} User
        </button>
        {/* <button className="bg-[#F2F2F2] rounded-sm px-4 py-1 text-gray-700 font-semibold cursor-pointer">Add Note</button> */}
        <CustomModal trigger={<button className="bg-[#F2F2F2] rounded-full px-4 py-1 text-gray-700 text-sm cursor-pointer">Add Note</button>} title={"Add Note"} >
          <EditChef id={id} />
        </CustomModal>
        <Link href="/?id=1" className="bg-[#F2F2F2] rounded-full px-4 py-1 text-gray-700 text-sm cursor-pointer flex items-center">Chat</Link>
        <CustomModal
          trigger={<button className="bg-[#F2F2F2] rounded-full px-4 py-1 text-gray-700 text-sm cursor-pointer">Verify Chef</button>}
          title={`Verify Chef - ${chefDetails?.name}`}
          contentClass="max-w-2xl w-[90vw] md:w-[600px] max-h-[85vh] flex flex-col justify-between"
        >
          {/* Scrollable details */}
          <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2 text-sm text-gray-700">
            {/* Basic Verification Info Grid */}
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div>
                <p className="text-gray-400 font-medium">Professional Chef Status</p>
                <p className="font-semibold text-gray-800">{chefDetails?.is_professional_chef ? "Professional Chef" : "Home Cook / Hobbyist"}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Verification Completed</p>
                <p className={`font-semibold ${chefDetails?.verification_completed ? "text-green-600" : "text-red-500"}`}>
                  {chefDetails?.verification_completed ? "Yes" : "Pending"}
                </p>
              </div>
            </div>

            {/* Status Checks Grid */}
            <div className="space-y-3 border-b pb-4">
              <h4 className="font-semibold text-gray-900">System Checklist</h4>

              {/* NID Verification */}
              <div className="flex justify-between items-start gap-4 bg-gray-50 p-2.5 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">NID / ID Card Verification</p>
                  {chefDetails?.nid_verification_status?.reason && (
                    <p className="text-xs text-gray-500 mt-0.5">{chefDetails.nid_verification_status.reason}</p>
                  )}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${chefDetails?.nid_verification_status?.status === "Passed" || chefDetails?.nid_verification_status?.status === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  }`}>
                  {chefDetails?.nid_verification_status?.status || "Failed"}
                </span>
              </div>

              {/* Food Safety */}
              <div className="flex justify-between items-start gap-4 bg-gray-50 p-2.5 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">Food Safety Certificate</p>
                  {chefDetails?.food_safety_certificate_status?.reason && (
                    <p className="text-xs text-gray-500 mt-0.5">{chefDetails.food_safety_certificate_status.reason}</p>
                  )}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${chefDetails?.food_safety_certificate_status?.isValid
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  }`}>
                  {chefDetails?.food_safety_certificate_status?.isValid ? "Valid" : "Invalid"}
                </span>
              </div>

              {/* Sex Offender Check */}
              <div className="flex justify-between items-start gap-4 bg-gray-50 p-2.5 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">Sex Offender Background Check</p>
                  {chefDetails?.sex_offender_check_status?.reason && (
                    <p className="text-xs text-gray-500 mt-0.5">{chefDetails.sex_offender_check_status.reason}</p>
                  )}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${chefDetails?.sex_offender_check_status?.status === "Passed" || chefDetails?.sex_offender_check_status?.status === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  }`}>
                  {chefDetails?.sex_offender_check_status?.status || "Failed"}
                </span>
              </div>
            </div>

            {/* Documents Grid */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Uploaded Documents</h4>

              <div className="grid grid-cols-2 gap-4">
                {/* ID Card */}
                {chefDetails?.id_card?.image && (
                  <div className="border rounded-lg p-2 flex flex-col gap-1.5 bg-gray-50">
                    <p className="font-medium text-xs text-gray-500">ID Card (Photo)</p>
                    <a href={formatUrl(chefDetails.id_card.image)} target="_blank" rel="noopener noreferrer" className="relative group overflow-hidden rounded-md border aspect-video block bg-white">
                      <Image src={formatUrl(chefDetails.id_card.image)} alt="ID Card" fill className="object-cover group-hover:scale-105 transition duration-300" unoptimized />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium z-10 transition duration-300">View Full Image</div>
                    </a>
                  </div>
                )}

                {/* Food Safety Cert */}
                {chefDetails?.food_safety_certificate && (
                  <div className="border rounded-lg p-2 flex flex-col gap-1.5 bg-gray-50">
                    <p className="font-medium text-xs text-gray-500">Food Safety Cert</p>
                    <a href={formatUrl(chefDetails.food_safety_certificate)} target="_blank" rel="noopener noreferrer" className="relative group overflow-hidden rounded-md border aspect-video block bg-white">
                      <Image src={formatUrl(chefDetails.food_safety_certificate)} alt="Food Safety Cert" fill className="object-cover group-hover:scale-105 transition duration-300" unoptimized />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium z-10 transition duration-300">View Full Image</div>
                    </a>
                  </div>
                )}

                {/* Proof of Address */}
                {chefDetails?.proof_of_address && (
                  <div className="border rounded-lg p-2 flex flex-col gap-1.5 bg-gray-50">
                    <p className="font-medium text-xs text-gray-500">Proof of Address</p>
                    <a href={formatUrl(chefDetails.proof_of_address)} target="_blank" rel="noopener noreferrer" className="relative group overflow-hidden rounded-md border aspect-video block bg-white">
                      <Image src={formatUrl(chefDetails.proof_of_address)} alt="Proof of Address" fill className="object-cover group-hover:scale-105 transition duration-300" unoptimized />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium z-10 transition duration-300">View Full Image</div>
                    </a>
                  </div>
                )}

                {/* Additional Culinary Licences */}
                {chefDetails?.additional_culinary_licenses && chefDetails.additional_culinary_licenses.length > 0 && (
                  <div className="border rounded-lg p-2 flex flex-col gap-1.5 bg-gray-50">
                    <p className="font-medium text-xs text-gray-500">Culinary License</p>
                    <a href={formatUrl(chefDetails.additional_culinary_licenses[0])} target="_blank" rel="noopener noreferrer" className="relative group overflow-hidden rounded-md border aspect-video block bg-white">
                      <Image src={formatUrl(chefDetails.additional_culinary_licenses[0])} alt="Culinary License" fill className="object-cover group-hover:scale-105 transition duration-300" unoptimized />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium z-10 transition duration-300">View Full Image</div>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex gap-3 justify-end pt-4 border-t mt-4">
            <button type="button" onClick={() => closedCustomModal()} className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 text-sm font-semibold cursor-pointer">
              Skip
            </button>
            <button
              type="button"
              onClick={handleApprove}
              disabled={chefDetails?.verification_completed}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/90 text-sm font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Approve
            </button>
          </div>
        </CustomModal>
      </div>
    </div>
  );
}
