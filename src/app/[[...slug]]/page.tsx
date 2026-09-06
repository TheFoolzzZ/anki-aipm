import Studio from '@/components/studio';
export default async function Page({params}:{params:Promise<{slug?:string[]}>}){const {slug}=await params;return <Studio route={slug||['today']}/>}
