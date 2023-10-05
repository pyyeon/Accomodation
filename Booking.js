const readlineSync = require('readline-sync');
const { format, addDays } = require('date-fns');


class BookingSystem {
    constructor() {
        this.sc = readlineSync;
        this.loginCheck = false;
        this.memberLoggedIn = null;
        this.members = {};
        this.accommodation = new Accommodation();
        this.run();
        this.reservations = {};
    }

    run() {
        console.log("숙소 예약 서비스에 오신걸 환영합니다.");

        while (true) {
            console.log("1. 객실 보기");
            console.log("2. 객실 예약하기");
            console.log("3. 예약 확인하기");
            console.log("4. 회원 정보 수정");
            console.log("5. 회원 탈퇴");
            console.log("6. 로그아웃");
            console.log("7. 종료하기");

            const choice = this.sc.question("원하시는 메뉴를 선택하세요: ");

            switch (choice) {
                case '1':
                    this.accommodation.getRoomInfo();
                    break;
                case '2':
                    this.accommodation.reserveRoom();
                    break;
                case '3':
                    this.accommodation.getReservation();
                    break;
                case '4':
                    this.updateMemberInfo();
                    break;
                case '5':
                    this.quit();
                    break;
                case '6':
                    this.logout();
                    break;
                case '7':
                    console.log("프로그램을 종료합니다.");
                    process.exit(0);
                default:
                    console.log("잘못된 선택입니다. 다시 선택해주세요.");
            }
        }
    }

    signUp() {
        let name, id, password, phoneNumber, birthday;
        while (true) {
            console.log("회원가입 절차");
            name = this.sc.question("이름을 입력해 주세요: ");
            if (name.length > 10) {
                console.log("이름이 너무 깁니다.");
            } else if (!name.match(/^[가-힣]*$/)) {
                console.log("한글만 입력할 수 있습니다. (자음 불가)");
            } else {
                break;
            }
        }

        // 아이디 입력
        while (true) {
            id = this.sc.question("아이디를 입력해주세요 (4자 이상 10자 이내): ");
            if (id.length > 10 || id.length < 4) {
                console.log("ID의 길이가 올바르지 않습니다.");
            } else if (!id.match(/\w+/)) {
                console.log("알파벳, 숫자만 입력해주세요.");
            } else if (this.members[id]) {
                console.log("동일한 ID가 존재합니다.");
                console.log("다른 아이디를 입력해주세요.");
            } else {
                break;
            }
        }

        // 비밀번호 입력
        while (true) {
            password = this.sc.question("비밀번호를 입력해주세요 (6자 이상 10자 이내): ");
            if (password.length < 6 || password.length > 10) {
                console.log("비밀번호의 길이가 올바르지 않습니다.");
            } else {
                break;
            }
        }

        // 전화번호 입력
        while (true) {
            phoneNumber = this.sc.question("휴대전화 번호를 입력해주세요 (Ex: 01012345678): ");
            if (phoneNumber.match(/^010[0-9]{8}$/)) {
                break;
            } else {
                console.log("잘못된 휴대전화 번호입니다. 다시 입력해주세요.");
            }
        }

        // 생년월일 입력
        while (true) {
            birthday = this.sc.question("생년월일 8자리를 입력해주세요 (Ex: 19960715): ");
            if (birthday.match(/^(19[0-9]|20[0-9])[0-1][0-9][0-3][0-9]$/)) {
                break;
            } else {
                console.log("잘못된 형식입니다. 다시 입력해주세요.");
            }
        }

        console.log("성공적으로 회원가입을 하셨습니다.!!");
        console.log(name + "님 환영합니다!");
        this.loginCheck = true;
        this.memberLoggedIn = { id, name, password, phoneNumber, birthday };
        this.members[id] = this.memberLoggedIn;
    }

    login() {
        console.log("로그인");
        const id = this.sc.question("ID 입력: ");
        const password = this.sc.question("비밀번호 입력: ");
        if (!this.members[id]) {
            console.log("ID를 확인해주세요.");
        } else {
            if (this.members[id].password !== password) {
                console.log("비밀번호를 확인해주세요.");
            } else {
                this.loginCheck = true;
                this.memberLoggedIn = this.members[id];
                console.log("로그인 성공");
            }
        }
    }

    updateMemberInfo() {
        if (!this.loginCheck) {
            console.log("로그인이 필요합니다.");
            return;
        }

        console.log("회원 정보 수정");
        console.log("1. 이름 수정");
        console.log("2. 비밀번호 수정");
        console.log("3. 전화번호 수정");
        console.log("4. 생년월일 수정");
        console.log("5. 뒤로 가기");

        const choice = this.sc.question("수정할 항목을 선택하세요: ");

        switch (choice) {
            case '1':
                this.memberLoggedIn.name = this.sc.question("새로운 이름을 입력하세요: ");
                console.log("이름이 성공적으로 수정되었습니다.");
                break;
            case '2':
                this.memberLoggedIn.password = this.sc.question("새로운 비밀번호를 입력하세요: ");
                console.log("비밀번호가 성공적으로 수정되었습니다.");
                break;
            case '3':
                this.memberLoggedIn.phoneNumber = this.sc.question("새로운 전화번호를 입력하세요: ");
                console.log("전화번호가 성공적으로 수정되었습니다.");
                break;
            case '4':
                this.memberLoggedIn.birthday = this.sc.question("새로운 생년월일을 입력하세요 (Ex: 19960715): ");
                console.log("생년월일이 성공적으로 수정되었습니다.");
                break;
            case '5':
                console.log("뒤로 가기");
                break;
            default:
                console.log("잘못된 선택입니다.");
        }
    }

    quit() {
        if (!this.loginCheck || !this.memberLoggedIn) {
            console.log("로그인 상태가 아닙니다.");
            return;
        }

        const memberId = this.memberLoggedIn.id;
        if (this.members[memberId]) {
            console.log(`${this.members[memberId].name}님, 회원 탈퇴가 완료되었습니다.`);
            delete this.members[memberId]; // 회원 정보 삭제
            this.loginCheck = false;
            this.memberLoggedIn = null;
        } else {
            console.log("회원 정보를 찾을 수 없습니다.");
        }
    }

constructor() {
    // 객실 정보 초기화 또는 파일에서 읽어오는 로직을 구현
    this.rooms = [
        { id: 1, type: '싱글룸', price: 50000, available: true, facilities: ['TV', '에어컨'] },
        { id: 2, type: '더블룸', price: 80000, available: true, facilities: ['TV', '에어컨', '미니바'] },
       
    ];
}

getRoomInfo() {
    console.log("객실 정보:");

    for (const room of this.rooms) {
        console.log(`ID: ${room.id}`);
        console.log(`유형: ${room.type}`);
        console.log(`가격: ${room.price}원`);
        console.log(`예약 가능 여부: ${room.available ? '예약 가능' : '예약 불가능'}`);
        console.log(`편의시설: ${room.facilities.join(', ')}`);
        console.log('---');
    }
}

selectDate() {
    console.log("날짜를 선택하세요.");
    const today = new Date();
    const minDate = format(today, 'yyyy-MM-dd');
    const maxDate = format(addDays(today, 365), 'yyyy-MM-dd');
    const selectedDate = readlineSync.question("날짜를 입력하세요 (yyyy-MM-dd 형식): ", {
        limit: input => {
            return format(new Date(input), 'yyyy-MM-dd') >= minDate &&
                   format(new Date(input), 'yyyy-MM-dd') <= maxDate;
        },
        limitMessage: `올바른 날짜를 입력하세요 (${minDate} ~ ${maxDate})`
    });

    return new Date(selectedDate);
}
setRoom(reservation) {
    console.log("객실 목록:");
    this.rooms.forEach(room => {
        console.log(`ID: ${room.id}, 타입: ${room.type}, 가격: ${room.price}`);
    });

    while (true) {
        const selectedRoomId = readlineSync.question("예약할 객실의 ID를 입력하세요: ");
        const selectedRoom = this.rooms.find(room => room.id === selectedRoomId);

        if (selectedRoom && selectedRoom.available) {
            reservation.roomId = selectedRoomId;
            console.log(`객실 ${selectedRoomId}(${selectedRoom.type})을 선택하셨습니다.`);
            break;
        } else {
            console.log("올바른 객실 ID를 입력하세요 또는 이미 예약된 객실입니다.");
        }
    }
}


setNumberPeople(reservation) {
    console.log("숙박인원을 선택하세요.");
    
    // 인원 선택 로직 추가
    const options = ['1인', '2인', '3인', '4인 이상'];
    console.log("인원 옵션:");
    for (let i = 0; i < options.length; i++) {
        console.log(`${i + 1}. ${options[i]}`);
    }
    
    const choice = this.sc.question("숙박인원을 선택하세요 (번호 입력): ");
    
    switch (choice) {
        case '1':
            reservation.numberOfPeople = '1인';
            break;
        case '2':
            reservation.numberOfPeople = '2인';
            break;
        case '3':
            reservation.numberOfPeople = '3인';
            break;
        case '4':
            reservation.numberOfPeople = '4인 이상';
            break;
        default:
            console.log("잘못된 선택입니다. 1에서 4 중에서 선택하세요.");
            this.setNumberPeople(reservation); // 재귀 호출로 다시 선택하도록 유도
            return;
    }
    
    console.log(`선택한 숙박인원: ${reservation.numberOfPeople}`);
}

setService(reservation) {
    console.log("부가 서비스를 선택하세요.");
    
    // 부가 서비스 선택 로직 추가
    const options = ['와이파이', '조식', '수영장 이용'];
    console.log("부가 서비스 옵션:");
    for (let i = 0; i < options.length; i++) {
        console.log(`${i + 1}. ${options[i]}`);
    }
    
    const choice = this.sc.question("부가 서비스를 선택하세요 (번호 입력): ");
    
    switch (choice) {
        case '1':
            reservation.service = '와이파이';
            break;
        case '2':
            reservation.service = '조식';
            break;
        case '3':
            reservation.service = '수영장 이용';
            break;
        default:
            console.log("잘못된 선택입니다. 1에서 3 중에서 선택하세요.");
            this.setService(reservation); // 재귀 호출로 다시 선택하도록 유도
            return;
    }
    
    console.log(`선택한 부가 서비스: ${reservation.service}`);
}


reserveRoom(roomId, guestName) {
    const checkInDate = this.selectDate();
    const checkOutDate = this.selectDate();
    const reservation = {
        roomId: null,
        guestName: guestName,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        // 기타 예약 정보 필드들을 추가할 수 있음
    };

    if (this.setReservationDetails(reservation)) {
        const room = this.rooms.find(room => room.id === roomId);

        if (!room) {
            console.log("해당 객실을 찾을 수 없습니다.");
            return;
        }

        if (!room.available) {
            console.log("이미 예약된 객실입니다.");
            return;
        }

        // 예약 정보 저장
        this.reservations[room.id] = reservation;

        // 예약된 객실 상태 변경
        room.available = false;

        console.log(`${guestName}님, 객실 ${room.id}(${room.type})을 ${format(checkInDate, 'yyyy-MM-dd')}부터 ${format(checkOutDate, 'yyyy-MM-dd')}까지 예약하였습니다.`);
    }
}

setReservationDetails(reservation) {
    if (this.setRoom(reservation) && this.setNumberPeople(reservation) && this.setService(reservation)) {
        return true;
    } else {
        console.log("예약 정보 입력 중 오류가 발생했습니다. 다시 시도해주세요.");
        return false;
    }
}

setRoom(reservation) {
    console.log("객실 목록:");
    this.rooms.forEach(room => {
        console.log(`ID: ${room.id}, 타입: ${room.type}, 가격: ${room.price}`);
    });

    while (true) {
        const selectedRoomId = this.sc.question("예약할 객실의 ID를 입력하세요: ");
        const selectedRoom = this.rooms.find(room => room.id === selectedRoomId);

        if (selectedRoom && selectedRoom.available) {
            reservation.roomId = selectedRoomId;
            console.log(`객실 ${selectedRoomId}(${selectedRoom.type})을 선택하셨습니다.`);
            return true;
        } else {
            console.log("올바른 객실 ID를 입력하세요 또는 이미 예약된 객실입니다.");
        }
    }
}


getReservation() {
    console.log("예약 정보를 확인합니다.");

    const roomId = this.sc.question("객실 ID를 입력하세요: ");
    const reservation = this.reservations[roomId];

    if (reservation) {
        console.log("예약 정보:");
        console.log(`객실 ID: ${roomId}`);
        console.log(`예약자 이름: ${reservation.guestName}`);
        console.log(`체크인 날짜: ${format(reservation.checkInDate, 'yyyy-MM-dd')}`);
        console.log(`체크아웃 날짜: ${format(reservation.checkOutDate, 'yyyy-MM-dd')}`);
        if (reservation.roomId) {
            console.log(`선택한 객실: ${reservation.roomId}`);
        }
        if (reservation.people) {
            console.log(`숙박인원: ${reservation.people}명`);
        }
        if (reservation.service) {
            console.log(`부가 서비스: ${reservation.service}`);
        }

        console.log("1. 예약 변경");
        console.log("2. 예약 취소");
        console.log("3. 뒤로 가기");

        const choice = this.sc.question("원하는 작업을 선택하세요: ");

        switch (choice) {
            case '1':
                this.changeReservation(roomId, reservation);
                break;
            case '2':
                this.cancelReservation(roomId);
                break;
            case '3':
                console.log("뒤로 가기");
                break;
            default:
                console.log("잘못된 선택입니다.");
        }
    } else {
        console.log("해당 객실에 대한 예약 정보가 없습니다.");
    }
}

cancelReservation(roomId) {
    console.log("예약을 취소합니다.");
    const room = this.rooms.find(room => room.id === roomId);

    if (room) {
        room.available = true;
        delete this.reservations[roomId];
        console.log(`객실 ${roomId}(${room.type}) 예약이 취소되었습니다.`);
    } else {
        console.log("객실을 찾을 수 없습니다.");
    }
}

changeReservation(roomId, reservation) {
    console.log("예약을 변경합니다.");
    console.log("1. 객실 변경");
    console.log("2. 숙박인원 변경");
    console.log("3. 부가 서비스 변경");
    console.log("4. 뒤로 가기");

    const choice = this.sc.question("변경할 항목을 선택하세요: ");

    switch (choice) {
        case '1':
            this.setRoom(reservation);
            break;
        case '2':
            this.setNumberPeople(reservation);
            break;
        case '3':
            this.setService(reservation);
            break;
        case '4':
            console.log("뒤로 가기");
            break;
        default:
            console.log("잘못된 선택입니다.");
    }
}
}


// Booking 클래스의 인스턴스를 생성하여 프로그램을 시작
new BookingSystem();

   