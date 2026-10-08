import { ColumnDef } from "@tanstack/react-table"
import { IDiscount } from "@/types/columnTypes";
import { RiEdit2Line } from "react-icons/ri";
import PromoCodeForm from "@/app/(CommonLayout)/payments-and-discounts/PromoCodeForm";
import { CustomModal } from "@/components/cui/CustomModal";

export const discountColumns: ColumnDef<IDiscount>[] = [
  {
    accessorKey: "code",
    header: () => <div className="ps-2">Code</div>,
    cell: ({ row }) => (
      <div className="capitalize ps-2">{row.getValue("code")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: () => <div className="">Type</div>,
    cell: ({ row }) => (
      <div className="">{row.getValue("type")}</div>
    ),
  },
  {
    accessorKey: "appliesTo",
    header: () => <div className="">Applies to</div>,
    cell: ({ row }) => (
      <div className="">{row.getValue("appliesTo")}</div>
    ),
  },
  {
    accessorKey: "minimumOrder",
    header: () => <div className="">Minimum Order</div>,
    cell: ({ row }) => (
      <div className="">{row.getValue("minimumOrder")}</div>
    ),
  },
  {
    accessorKey: "usage",
    header: () => <div className="">Usage</div>,
    cell: ({ row }) => {
      const usage: { used: number; total: number } = row.getValue("usage");
      return (
        <div className="">{`${usage?.used}/${usage?.total}`}</div>
      )
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="">Status</div>,
    cell: ({ row }) => (
      <div className="">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "validUntil",
    header: () => <div className="">Valid until</div>,
    cell: ({ row }) => (
      <div className="">{row.getValue("validUntil")}</div>
    ),
  },
  {
    accessorKey: "createdBy",
    header: () => <div className="">Created by</div>,
    cell: ({ row }) => (
      <div className="">{row.getValue("createdBy")}</div>
    ),
  },
  {
    id: "action",
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <CustomModal trigger={<RiEdit2Line onClick={() => console.log("Note Id : ", row.original.id)} className="size-6 cursor-pointer text-gray-600" />} title={"Edit Promo Code"} contentClass="w-[500px] rounded-2xl">
          <PromoCodeForm id={row.original.id} />
        </CustomModal>
      </div>
    ),
  }
]