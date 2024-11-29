import ComponentLoader from '@/app/components/Loader/ComponentLoader';
import React, { ReactElement } from 'react'

interface Props {
    tableHeaders: ReactElement[];
    tableHeaderStyle?: string;
    tableDataStyle?: string;
    tableRowsData: ReactElement[][];
    rowClickFunction?: () => void;
    isLoading?: boolean;
    /**
     * Message to display when there is no data
     */
    nullDataMessage?: string;
};

const Table = (props: Props) => {
    return (
        <table className="bg-white w-full rounded-2xl">
            <tbody>
                <tr className="bg-dark-grey border-b-[1px] border-dark-grey/10">
                    {
                        props.tableHeaders.map((header, index) => {
                            return (
                                <th
                                    key={index}
                                    className={`text-base font-semibold text-primary whitespace-nowrap p-3 text-left bg-light-grey ${props.tableHeaderStyle}`}>
                                    {header}
                                </th>
                            )
                        })
                    }
                </tr>
                {
                    // Show data is loader is not active, and there is data
                    !props.isLoading && props.tableRowsData.map((row, index) => {
                        return (
                            <tr key={index}
                                onClick={props.rowClickFunction ? props.rowClickFunction : () => { }}
                                className={`border-b-[1px] border-dark-grey/10 last:border-b-0 
                                ${props.rowClickFunction ? "hover:bg-gray-200 cursor-pointer" : ""}`}>
                                {
                                    row.map((data, index) => {
                                        return (
                                            <td key={index} className={`p-3 text-sm ${props.tableDataStyle}`}>
                                                {data}
                                            </td>
                                        )
                                    })
                                }
                            </tr>
                        )
                    })
                }
                {
                    // Show loader if loader is active
                    props.isLoading &&
                    <tr className="bg-dark-grey border-b-[1px] border-dark-grey/10">
                        <td className=' row-span-full bg-white' colSpan={8}>
                            <div className='h-52 relative grid place-items-center'>
                                <ComponentLoader className='!w-10 !h-10' />
                            </div>
                        </td>
                    </tr>
                }
                {
                    // Show no data message if loader is not active and there is no data
                    !props.isLoading && (props.tableRowsData.length === 0 || !props.tableRowsData) &&
                    <tr className="bg-dark-grey border-b-[1px] border-dark-grey/10">
                        <td className=' row-span-full bg-white' colSpan={8}>
                            <div className='h-52 relative grid place-items-center'>
                                <p className='text-black'>
                                    {props.nullDataMessage ?? "No data available"}
                                </p>
                            </div>
                        </td>
                    </tr>
                }
            </tbody>
        </table>
    )
}

export default Table