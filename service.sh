#!/bin/bash

# 服务管理脚本
# 用于管理本地HTTP服务器

PORT=8010
SCRIPT_NAME=$(basename "$0")

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查服务是否正在运行
check_service() {
    local pid=$(lsof -ti :$PORT)
    if [ -n "$pid" ]; then
        echo -e "${GREEN}服务正在运行 (PID: $pid, 端口: $PORT)${NC}"
        return 0
    else
        echo -e "${RED}服务未运行${NC}"
        return 1
    fi
}

# 启动服务
start_service() {
    if check_service >/dev/null 2>&1; then
        echo -e "${YELLOW}服务已经在运行中，无需重复启动${NC}"
        return 0
    fi
    
    echo -e "${GREEN}正在启动服务...${NC}"
    cd "$(dirname "$0")"
    
    # 启动服务并放到后台
    nohup python3 -m http.server $PORT --bind 0.0.0.0 > server.log 2>&1 &
    local pid=$!
    
    # 等待服务启动
    sleep 2
    
    # 验证服务是否成功启动
    if check_service >/dev/null 2>&1; then
        echo -e "${GREEN}服务启动成功！${NC}"
        echo "访问地址："
        echo "  本地: http://localhost:$PORT"
        echo "  局域网: http://$(ipconfig getifaddr en0):$PORT"
        echo "日志文件: server.log"
    else
        echo -e "${RED}服务启动失败，请检查错误日志${NC}"
        echo "查看日志: tail -f server.log"
        return 1
    fi
}

# 停止服务
stop_service() {
    local pid=$(lsof -ti :$PORT)
    if [ -z "$pid" ]; then
        echo -e "${YELLOW}服务未运行，无需停止${NC}"
        return 0
    fi
    
    echo -e "${GREEN}正在停止服务...${NC}"
    
    # 杀死进程
    kill $pid 2>/dev/null
    
    # 等待进程完全结束
    sleep 1
    
    # 强制杀死如果还有残留
    kill -9 $pid 2>/dev/null
    
    # 验证是否已停止
    if ! check_service >/dev/null 2>&1; then
        echo -e "${GREEN}服务已停止${NC}"
        return 0
    else
        echo -e "${RED}服务停止失败${NC}"
        return 1
    fi
}

# 显示帮助信息
show_help() {
    echo "用法: ./$SCRIPT_NAME [选项]"
    echo ""
    echo "选项:"
    echo "  start    启动服务"
    echo "  stop     停止服务"
    echo "  status   检查服务状态（默认）"
    echo "  help     显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  ./$SCRIPT_NAME          # 检查服务状态"
    echo "  ./$SCRIPT_NAME start    # 启动服务"
    echo "  ./$SCRIPT_NAME stop     # 停止服务"
}

# 主程序逻辑
case "${1:-status}" in
    start)
        start_service
        ;;
    stop)
        stop_service
        ;;
    status)
        check_service
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}未知选项: $1${NC}"
        show_help
        exit 1
        ;;
esac