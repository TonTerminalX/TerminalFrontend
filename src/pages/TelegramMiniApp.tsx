'use client'

import { useCallback, useEffect, useState } from 'react'
// import { Search, Table, Wallet } from 'lucide-react'
import { TonConnectButton, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'
import { TokenDetail } from '../components/TokenDetail'
import { Button } from '../components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '../components/ui/table'
import { Search } from 'lucide-react'
import WebApp from '@twa-dev/sdk'

interface TradingPair {
    id: string
    name: string
    icon: string
    marketCap: number
    volume: number
}

const exampleTradingPairs: TradingPair[] = [
    { id: "1", name: "DOGS", icon: "/placeholder.svg?height=24&width=24", marketCap: 340000000, volume: 217000000 },
    { id: "2", name: "Scale", icon: "/placeholder.svg?height=24&width=24", marketCap: 340000000, volume: 217000000 },
    { id: "3", name: "Durev", icon: "/placeholder.svg?height=24&width=24", marketCap: 340000000, volume: 217000000 },
    { id: "4", name: "TCAT", icon: "/placeholder.svg?height=24&width=24", marketCap: 340000000, volume: 217000000 },
    { id: "5", name: "AIC", icon: "/placeholder.svg?height=24&width=24", marketCap: 340000000, volume: 217000000 },
    { id: "6", name: "AMORE", icon: "/placeholder.svg?height=24&width=24", marketCap: 340000000, volume: 217000000 },
    { id: "7", name: "Redo", icon: "/placeholder.svg?height=24&width=24", marketCap: 340000000, volume: 217000000 },
    { id: "8", name: "Batya", icon: "/placeholder.svg?height=24&width=24", marketCap: 340000000, volume: 217000000 },
];

function TradingPairsList({ onSelectPair }: { onSelectPair: (id: string) => void }) {
    const [page, setPage] = useState(1)
    const itemsPerPage = 5
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const displayedPairs = exampleTradingPairs.slice(startIndex, endIndex)

    const formatMillions = (value: number) => {
        return `$${(value / 1000000).toFixed(1)}m`
    }

    return (
        <>
            {/* Trading Pairs List */}
            <div className="flex-1 overflow-auto">
                <Table>
                    <TableBody>
                        {displayedPairs.map((pair) => (
                            <TableRow
                                key={pair.id}
                                className="border-gray-800 hover:bg-gray-800 cursor-pointer transition-colors"
                                onClick={() => onSelectPair(pair.id)}
                            >
                                <TableCell className="flex items-center gap-3">
                                    <img
                                        src={pair.icon}
                                        alt=""
                                        className="w-6 h-6 rounded-full"
                                    />
                                    <span className="font-medium">{pair.name}</span>
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMillions(pair.marketCap)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMillions(pair.volume)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 p-4 border-t border-gray-800">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="border-gray-800 hover:bg-gray-800 bg-gray-900"
                >
                    {'<'}
                </Button>
                {[1, 2, 3].map((p) => (
                    <Button
                        key={p}
                        variant={page === p ? "default" : "outline"}
                        size="icon"
                        onClick={() => setPage(p)}
                        className={page === p ? "bg-blue-500" : "border-gray-800 hover:bg-gray-800 bg-gray-900"}
                    >
                        {p}
                    </Button>
                ))}
                <span className="flex items-center">...</span>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(p => Math.min(p + 1, Math.ceil(exampleTradingPairs.length / itemsPerPage)))}
                    className="border-gray-800 hover:bg-gray-800 bg-gray-900"
                >
                    {'>'}
                </Button>
            </div>
        </>
    )
}

export default function TelegramMiniApp() {
    const [selectedPairId, setSelectedPairId] = useState<string | null>(null)
    const [signedMessage, setSignedMessage] = useState<string | null>(null)

    const connected = useTonWallet()
    const [tonConnectUi] = useTonConnectUI();


    // const handleConnect = useCallback(() => {
    //     open()
    // }, [open])

    const handleSignMessage = useCallback(async () => {
        if (!connected) return

        const message = 'Welcome to TerminalX!'
        try {
            const result = await tonConnectUi.sendTransaction({
                validUntil: Math.floor(Date.now() / 1000) + 60, // Valid for 60 seconds
                messages: [
                    {
                        address: '0:8c397c43f9ff0b49659b5d0a302b1a93af7ccc63e5f5c0c4f25a9dc1f8b47ab3',
                        amount: '1',
                        payload: Buffer.from(message).toString('hex'),
                    },
                ],
            })
            setSignedMessage(result.boc)
        } catch (error) {
            console.error('Error signing message:', error)
        }
    }, [connected])

    useEffect(() => {
        // Set the app header color
        WebApp.setHeaderColor('#0a0a0a');

        // Expand the app to full height
        WebApp.expand();

        // You can also use WebApp.ready() here if needed
        WebApp.ready();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <h1 className="text-lg font-semibold">TerminalX</h1>
                    <span className="text-xs text-gray-500">bot</span>
                </div>
                <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="text-blue-500 hover:bg-gray-800">
                        <Search className="h-5 w-5" />
                    </Button>
                    {connected ? (
                        <Button onClick={handleSignMessage} variant="ghost" className="text-blue-500 hover:bg-gray-800">
                            Sign
                        </Button>
                    ) : (
                        // <Button onClick={handleConnect} variant="ghost" className="text-blue-500 hover:bg-gray-800">
                        //   <Wallet className="h-5 w-5 mr-2" />
                        //   Connect Wallet
                        // </Button>
                        <TonConnectButton />
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 p-4 border-b border-gray-800">
                <p className="text-white hover:bg-gray-800">
                    Pairs
                </p>
                <p className="text-white">
                    My positions
                </p>
            </div>

            {connected && signedMessage && (
                <div className="p-4 bg-green-800 text-white">
                    Message signed successfully!
                </div>
            )}

            {selectedPairId ? (
                <TokenDetail pairId={selectedPairId} onBack={() => setSelectedPairId(null)} />
            ) : (
                <TradingPairsList onSelectPair={setSelectedPairId} />
            )}
        </div>
    )
}
